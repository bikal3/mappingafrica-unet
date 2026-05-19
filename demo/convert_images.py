"""
Pre-convert all satellite .tif files and prediction/label masks to PNG
for static GitHub Pages deployment.

Run from the project root directory:
  conda run -n torch-env python demo/convert_images.py
"""

import os
import csv
import numpy as np
import rasterio
from PIL import Image

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(BASE, "demo", "frontend", "public", "images")

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

IMAGES_DIR     = os.path.join(BASE, "finetune_mappingafrica_256", "mappingafrica-256", "images")
PREDICTIONS_DIR = os.path.join(BASE, "predictions", "HardScore")
CATALOG_PATH   = os.path.join(BASE, "finetune_mappingafrica_256", "catalog_fixed.csv")

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


def save_png(arr: np.ndarray, path: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    Image.fromarray(arr).save(path, format="PNG", optimize=True)


def load_label_map() -> dict:
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


def main():
    label_map = load_label_map()
    print(f"Label map entries: {len(label_map)}")

    sat_dir  = os.path.join(OUT_DIR, "satellite")
    pred_dir = os.path.join(OUT_DIR, "predictions")
    lbl_dir  = os.path.join(OUT_DIR, "labels")
    os.makedirs(sat_dir, exist_ok=True)
    os.makedirs(pred_dir, exist_ok=True)
    os.makedirs(lbl_dir, exist_ok=True)

    ok = err = 0
    for sid in SAMPLE_IDS:
        # Satellite image
        src = os.path.join(IMAGES_DIR, f"{sid}.tif")
        dst = os.path.join(sat_dir, f"{sid}.png")
        if os.path.exists(src):
            save_png(tif_to_rgb(src), dst)
        else:
            print(f"  [WARN] satellite missing: {sid}")

        # Prediction mask
        src = os.path.join(PREDICTIONS_DIR, f"{sid}_pred.tif")
        dst = os.path.join(pred_dir, f"{sid}.png")
        if os.path.exists(src):
            save_png(mask_to_rgb(src), dst)
        else:
            print(f"  [WARN] prediction missing: {sid}")

        # Label mask
        base_name = sid.split("_2021")[0]
        src = label_map.get(base_name, "")
        dst = os.path.join(lbl_dir, f"{sid}.png")
        if src and os.path.exists(src):
            save_png(mask_to_rgb(src), dst)
        else:
            print(f"  [WARN] label missing: {sid}")

        ok += 1
        print(f"  [{ok}/{len(SAMPLE_IDS)}] {sid}")

    print(f"\nDone. Saved to {OUT_DIR}")
    print(f"satellite: {len(os.listdir(sat_dir))} | predictions: {len(os.listdir(pred_dir))} | labels: {len(os.listdir(lbl_dir))}")


if __name__ == "__main__":
    main()
