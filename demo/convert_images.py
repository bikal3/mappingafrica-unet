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

    written = {"satellite": 0, "predictions": 0, "labels": 0}
    skipped = {"satellite": [], "predictions": [], "labels": []}

    for i, sid in enumerate(SAMPLE_IDS, start=1):
        jobs = [
            ("satellite", os.path.join(IMAGES_DIR, f"{sid}.tif"), sat_dir, tif_to_rgb),
            ("predictions", os.path.join(PREDICTIONS_DIR, f"{sid}_pred.tif"), pred_dir, mask_to_rgb),
            ("labels", label_map.get(sid.rsplit("_", 1)[0], ""), lbl_dir, mask_to_rgb),
        ]
        for kind, src, out_dir, convert in jobs:
            if src and os.path.exists(src):
                save_png(convert(src), os.path.join(out_dir, f"{sid}.png"))
                written[kind] += 1
            else:
                skipped[kind].append(sid)
                print(f"  [WARN] {kind} missing: {sid}")

        print(f"  [{i}/{len(SAMPLE_IDS)}] {sid}")

    total_skipped = sum(len(v) for v in skipped.values())
    print(f"\nSaved to {OUT_DIR}")
    for kind in written:
        print(f"  {kind:12} {written[kind]}/{len(SAMPLE_IDS)} written, {len(skipped[kind])} skipped")

    if total_skipped:
        print(f"\nFAILED: {total_skipped} file(s) could not be converted.")
        return 1
    print(f"\nDone. All {len(SAMPLE_IDS) * 3} files written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
