# MappingAfrica UNet — Satellite Agricultural Field Segmentation

Fine-tuning a UNet semantic segmentation model on the [MappingAfrica](https://github.com/agroimpacts/ftw-mappingafrica-integration) dataset to segment agricultural fields in Zambia from 4-channel satellite imagery.

**Live demo →** https://bikal3.github.io/mappingafrica-unet/

---

## Overview

This project covers two tasks:

1. **MNIST Inference** — Evaluating a ResNet18 classifier adapted for 1-channel grayscale digit recognition (98.99% test accuracy).
2. **UNet Fine-tuning** — Transfer learning on a pre-trained UNet segmentation model, freezing the encoder and fine-tuning the decoder on a Zambia subset of the MappingAfrica dataset.

---

## Results

| Metric | Value |
|---|---|
| MNIST Test Accuracy | 98.99% |
| UNet Test Pixel Accuracy | 81.79% |
| UNet Test mIoU | 43.31% |

Training ran for 10 epochs with Adam (lr=1e-4) and CrossEntropyLoss on 500 samples.

---

## Model Architecture

**UNet** with 5 encoder blocks, a bottleneck, and 5 decoder blocks:

- **Input** — 4-channel satellite imagery (256×256 px)
- **Encoder** — DoubleConv blocks with MaxPool downsampling (4→64→128→256→512→1024 channels), frozen during fine-tuning
- **Bottleneck** — DoubleConv (1024→2048), trainable
- **Decoder** — ConvTranspose2d upsampling with skip connections (2048→1024→512→256→128→64), trainable
- **Output** — 1×1 Conv2d → 3 classes (256×256 px)

---

## Dataset

**MappingAfrica v2.0.0 / v1.3.0** — multi-spectral satellite imagery across African countries.

| Split | Samples |
|---|---|
| Fine-tune train | 500 |
| Fine-tune validate | 100 |
| Fine-tune test | 50 |
| Original training set | 4,005 |

- **Image size** — 256×256 pixels, 4 spectral channels
- **Region** — Zambia (ZM)
- **Classes** — 3, following the Fields of The World convention:

| id | Colour | Class | Mean share of test pixels |
|---|---|---|---|
| 0 | `#3c3c3c` | Non-field — land outside any agricultural field | 68.5% |
| 1 | `#228b22` | Field interior | 29.3% |
| 2 | `#1e90ff` | Field boundary — the edge between adjacent fields | 2.3% |

Class 0 is *not* missing data: `null_prop` is 0.0000 for every row of
`catalog_fixed.csv`. Class 0 tracks the catalog's `nonfld_prop` and classes 1+2
together track `fld_prop`, both at r = 0.9999.

---

## Project Structure

```
mappingafrica-unet/
├── unet_finetuning_evaluation.ipynb   # Main notebook (inference + fine-tuning)
├── unet_model.pth                     # Pre-trained UNet weights (not in git)
├── checkpoints/
│   └── unet_finetuned.pth             # Fine-tuned weights (not in git)
├── predictions/
│   └── HardScore/                     # 50 prediction .tif files
├── finetune_mappingafrica_256/        # Fine-tune dataset
│   ├── catalog_fixed.csv
│   └── mappingafrica-256/
│       ├── images/                    # Satellite .tif images (not in git)
│       └── labels/                    # Label masks (not in git)
└── demo/
    ├── api/
    │   └── main.py                    # FastAPI backend (local dev)
    ├── frontend/                      # React + Vite demo site
    │   ├── src/
    │   │   ├── App.jsx
    │   │   └── components/
    │   └── public/images/             # Pre-converted WebP tiles for static deploy
    ├── convert_images.py              # Converts .tif → WebP for static site
    ├── make_og_image.py               # Builds the social preview image
    ├── check_consistency.py           # Verifies displayed figures vs shipped images
    ├── start.sh                       # Starts both servers (macOS/Linux)
    └── start.ps1                      # Starts both servers (Windows)
```

---

## Running Locally

### Prerequisites
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) with a `torch-env` environment containing PyTorch, rasterio, FastAPI, and uvicorn
- Node.js (install via `conda install -c conda-forge nodejs`)

### Start both servers

```bash
# macOS / Linux, from the project root
./demo/start.sh
```

```powershell
# Windows, from the project root
.\demo\start.ps1
```

Both scripts use the `torch-env` environment; set `CONDA_ENV` to override.

Or start them separately:

```bash
# Backend (http://localhost:8000)
conda run -n torch-env uvicorn main:app --reload --host 0.0.0.0 --port 8000 \
  --app-dir demo/api

# Frontend (http://localhost:5173)
cd demo/frontend && conda run -n torch-env npm run dev
```

### Checks

```bash
cd demo/frontend && npm run lint     # ESLint
python demo/check_consistency.py     # figures vs the shipped image files
```

`check_consistency.py` asserts that the class colours, class shares, sample list
and training metrics agree across `src/data/project.js`, `demo/api/main.py`,
`demo/convert_images.py` and the mask images themselves. CI runs both on every
push and pull request, and again before any deploy.

### Re-generate static images (if raw .tif files are available)

```powershell
conda run -n torch-env python demo/convert_images.py
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Model | PyTorch, UNet |
| Data I/O | rasterio, NumPy, Pillow |
| Backend (local) | FastAPI, uvicorn |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| Deploy | GitHub Actions, GitHub Pages |
| Images | WebP — lossy q85 for satellite, lossless for masks |
| Checks | ESLint, `check_consistency.py` |
