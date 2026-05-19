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
- **Classes** — 3 (Null / Background, Agricultural Field Class 1, Agricultural Field Class 2)

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
    │   └── public/images/             # Pre-converted PNGs for static deploy
    ├── convert_images.py              # Converts .tif → PNG for static site
    └── start.ps1                      # Starts both servers locally
```

---

## Running Locally

### Prerequisites
- [Miniconda](https://docs.conda.io/en/latest/miniconda.html) with a `torch-env` environment containing PyTorch, rasterio, FastAPI, and uvicorn
- Node.js (install via `conda install -c conda-forge nodejs`)

### Start both servers

```powershell
# From the project root
.\demo\start.ps1
```

Or start them separately:

```powershell
# Backend (http://localhost:8000)
conda run -n torch-env uvicorn main:app --reload --host 0.0.0.0 --port 8000 `
  --app-dir demo/api

# Frontend (http://localhost:5173)
cd demo/frontend
conda run npm run dev
```

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
