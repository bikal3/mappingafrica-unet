import os
import io
import csv
import glob
import numpy as np
import rasterio
from PIL import Image
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="UNet Satellite Segmentation Demo")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PREDICTIONS_DIR = os.path.join(BASE, "predictions", "HardScore")
IMAGES_DIR = os.path.join(BASE, "finetune_mappingafrica_256", "mappingafrica-256", "images")
LABELS_DIR = os.path.join(BASE, "finetune_mappingafrica_256", "mappingafrica-256", "labels")
CATALOG_PATH = os.path.join(BASE, "finetune_mappingafrica_256", "catalog_fixed.csv")


def _build_label_map() -> dict:
    """Read catalog_fixed.csv and return {sample_id: absolute_label_path}."""
    result = {}
    if not os.path.exists(CATALOG_PATH):
        return result
    with open(CATALOG_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            name = row.get("name", "").strip()
            mask_rel = row.get("mask", "").strip()
            if name and mask_rel:
                abs_path = os.path.normpath(os.path.join(BASE, mask_rel.lstrip("./\\")))
                result[name] = abs_path
    return result


LABEL_MAP = _build_label_map()

TRAINING_METRICS = {
    "epochs": list(range(1, 11)),
    "train_loss": [0.5446, 0.5035, 0.4776, 0.4597, 0.4486, 0.4458, 0.4408, 0.4320, 0.4272, 0.4229],
    "val_loss":   [0.5567, 0.5133, 0.4811, 0.4809, 0.4626, 0.4538, 0.4587, 0.4555, 0.4503, 0.4456],
    "val_acc":    [0.7891, 0.8018, 0.8147, 0.8091, 0.8181, 0.8224, 0.8190, 0.8188, 0.8193, 0.8210],
    "val_miou":   [0.3994, 0.4072, 0.4099, 0.4126, 0.4109, 0.4136, 0.4148, 0.4116, 0.4154, 0.4118],
}

SAMPLE_IDS = [
    "ZM1622949_2021-08", "ZM1634599_2021-08", "ZM1634645_2021-08",
    "ZM1656379_2021-08", "ZM1702968_2021-08", "ZM1706637_2021-08",
    "ZM1712155_2021-08", "ZM1716286_2021-08", "ZM1717612_2021-08",
    "ZM1719919_2021-08", "ZM1829067_2021-08", "ZM1841419_2021-08",
    "ZM1858604_2021-08", "ZM1888408_2021-08", "ZM1911527_2021-08",
    "ZM1921657_2021-08", "ZM1933346_2021-08", "ZM1935028_2021-08",
    "ZM1975354_2021-08", "ZM1986959_2021-08", "ZM2011173_2021-08",
    "ZM2033581_2021-08", "ZM2079799_2021-08", "ZM2096868_2021-08",
    "ZM2117591_2021-08", "ZM2131550_2021-08", "ZM2137844_2021-08",
    "ZM2139930_2021-08", "ZM2145201_2021-08", "ZM2160265_2021-08",
    "ZM2169968_2021-08", "ZM2187890_2021-08", "ZM2211915_2021-08",
    "ZM2213703_2021-08", "ZM2219002_2021-08", "ZM2220204_2021-08",
    "ZM2236432_2021-08", "ZM2264538_2021-08", "ZM2267070_2021-08",
    "ZM2275008_2021-08", "ZM2288316_2021-08", "ZM2293344_2021-08",
    "ZM2295370_2021-08", "ZM2295847_2021-08", "ZM2304141_2021-08",
    "ZM2304231_2021-08", "ZM2305901_2021-08", "ZM2310085_2021-08",
    "ZM2310176_2021-08", "ZM2311332_2021-08",
]

SAMPLE_ID_SET = set(SAMPLE_IDS)

CLASS_COLORS = {
    0: [60, 60, 60],
    1: [34, 139, 34],
    2: [30, 144, 255],
}


def tif_to_rgb(path: str) -> np.ndarray:
    with rasterio.open(path) as src:
        data = src.read().astype(np.float32)
    bands = data[:3] if data.shape[0] >= 3 else np.stack([data[0]] * 3)
    for i in range(3):
        lo, hi = bands[i].min(), bands[i].max()
        bands[i] = (bands[i] - lo) / (hi - lo + 1e-8)
    return (bands * 255).astype(np.uint8).transpose(1, 2, 0)


def mask_to_rgb(path: str) -> np.ndarray:
    with rasterio.open(path) as src:
        mask = src.read(1).astype(np.int32)
    h, w = mask.shape
    rgb = np.zeros((h, w, 3), dtype=np.uint8)
    for cls, color in CLASS_COLORS.items():
        rgb[mask == cls] = color
    return rgb


def array_to_png(arr: np.ndarray) -> StreamingResponse:
    img = Image.fromarray(arr)
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png",
                             headers={"Cache-Control": "max-age=3600"})


@app.get("/api/debug")
def debug():
    return {
        "base": BASE,
        "images_dir": IMAGES_DIR,
        "images_exists": os.path.isdir(IMAGES_DIR),
        "predictions_dir": PREDICTIONS_DIR,
        "predictions_exists": os.path.isdir(PREDICTIONS_DIR),
        "label_map_size": len(LABEL_MAP),
    }


@app.get("/api/metrics")
def get_metrics():
    return {
        "training": TRAINING_METRICS,
        "final": {
            "pixel_accuracy": 0.8179,
            "miou": 0.4331,
            "mnist_accuracy": 0.9899,
        },
        "dataset": {
            "total_train": 4005,
            "total_labels": 4001,
            "finetune_train": 500,
            "finetune_val": 100,
            "finetune_test": 50,
        }
    }


@app.get("/api/samples")
def get_samples():
    return {"samples": SAMPLE_IDS, "total": len(SAMPLE_IDS)}


@app.get("/api/sample/{sample_id}/satellite")
def get_satellite(sample_id: str):
    if sample_id not in SAMPLE_ID_SET:
        raise HTTPException(404, "Sample not found")
    path = os.path.join(IMAGES_DIR, f"{sample_id}.tif")
    if not os.path.exists(path):
        raise HTTPException(404, f"Image file missing: {sample_id}")
    return array_to_png(tif_to_rgb(path))


@app.get("/api/sample/{sample_id}/prediction")
def get_prediction(sample_id: str):
    if sample_id not in SAMPLE_ID_SET:
        raise HTTPException(404, "Sample not found")
    path = os.path.join(PREDICTIONS_DIR, f"{sample_id}_pred.tif")
    if not os.path.exists(path):
        raise HTTPException(404, f"Prediction file missing: {sample_id}")
    return array_to_png(mask_to_rgb(path))


@app.get("/api/sample/{sample_id}/label")
def get_label(sample_id: str):
    if sample_id not in SAMPLE_ID_SET:
        raise HTTPException(404, "Sample not found")
    base_name = sample_id.split("_2021")[0]
    label_path = LABEL_MAP.get(base_name)
    if not label_path or not os.path.exists(label_path):
        raise HTTPException(404, f"Label file missing: {sample_id}")
    return array_to_png(mask_to_rgb(label_path))


# Serve React build as static files (must be last)
frontend_dist = os.path.normpath(
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "frontend", "dist")
)
if os.path.exists(frontend_dist):
    app.mount("/", StaticFiles(directory=frontend_dist, html=True), name="static")
