#!/usr/bin/env python3
"""
Check that the figures the site displays still agree with each other and with
the image files it ships.

Every check here corresponds to a defect the site actually had: the class
legend declaring colours the mask PNGs did not contain, the class shares being
inverted, and the sample list being hand-maintained in three files at once.

Run from anywhere:
  python demo/check_consistency.py

Exits non-zero if any check fails. Pixel checks are skipped, not failed, when
Pillow is unavailable.
"""

import ast
import json
import os
import subprocess
import sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND = os.path.join(BASE, "demo", "frontend")
JS_DATA = os.path.join(FRONTEND, "src", "data", "project.js")
API_PY = os.path.join(BASE, "demo", "api", "main.py")
CONVERT_PY = os.path.join(BASE, "demo", "convert_images.py")
IMAGES = os.path.join(FRONTEND, "public", "images")
KINDS = ("satellite", "labels", "predictions")

# api/main.py names these in snake_case; the JS module in camelCase.
METRIC_ALIASES = {
    "train_loss": "trainLoss",
    "val_loss": "valLoss",
    "val_acc": "valAcc",
    "val_miou": "valMiou",
}

failures = []
skipped = []


def check(name, condition, detail=""):
    if condition:
        print(f"  PASS  {name}")
    else:
        print(f"  FAIL  {name}")
        if detail:
            print(f"        {detail}")
        failures.append(name)


def skip(name, why):
    print(f"  SKIP  {name} — {why}")
    skipped.append(name)


def js_exports():
    """Import the data module with node and hand it back as JSON."""
    script = (
        "import('./src/data/project.js')"
        ".then(m => console.log(JSON.stringify({...m})))"
    )
    out = subprocess.run(
        ["node", "--input-type=module", "-e", script],
        cwd=FRONTEND, capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.exit(f"could not read {JS_DATA}:\n{out.stderr.strip()}")
    return json.loads(out.stdout)


# Enough to evaluate the plain-data idioms these modules use, and nothing else.
SAFE_BUILTINS = {"list": list, "range": range, "dict": dict, "tuple": tuple}


def _value(node):
    """literal_eval, falling back to a namespace with no builtins for
    expressions like list(range(1, 11))."""
    try:
        return ast.literal_eval(node)
    except ValueError:
        expr = ast.Expression(body=node)
        return eval(compile(expr, "<const>", "eval"), {"__builtins__": {}}, SAFE_BUILTINS)


def py_constants(path, names):
    """Pull module-level constants out without importing (no rasterio needed)."""
    tree = ast.parse(open(path, encoding="utf-8").read())
    found = {}
    for node in tree.body:
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name) and target.id in names:
                    found[target.id] = _value(node.value)
    missing = set(names) - set(found)
    if missing:
        sys.exit(f"{path}: could not find {', '.join(sorted(missing))}")
    return found


def hex_to_rgb(h):
    h = h.lstrip("#")
    return [int(h[i:i + 2], 16) for i in (0, 2, 4)]


def main():
    js = js_exports()
    api = py_constants(API_PY, {"CLASS_COLORS", "SAMPLE_IDS", "TRAINING_METRICS"})
    conv = py_constants(CONVERT_PY, {"CLASS_COLORS", "SAMPLE_IDS"})

    legend = {c["id"]: c for c in js["CLASS_LEGEND"]}

    print("\nclass colours")
    for cid, colour in sorted(api["CLASS_COLORS"].items()):
        declared = legend.get(cid)
        check(
            f"class {cid} legend colour matches api/main.py",
            declared is not None and hex_to_rgb(declared["color"]) == list(colour),
            f"legend={declared and declared['color']} api={colour}",
        )
    check(
        "convert_images.py and api/main.py agree on colours",
        conv["CLASS_COLORS"] == api["CLASS_COLORS"],
        f"{conv['CLASS_COLORS']} != {api['CLASS_COLORS']}",
    )
    check(
        "every class has a distinct description",
        len({c["desc"] for c in js["CLASS_LEGEND"]}) == len(js["CLASS_LEGEND"]),
    )

    print("\nsample list")
    check("JS and api/main.py list the same samples",
          js["SAMPLE_IDS"] == api["SAMPLE_IDS"])
    check("JS and convert_images.py list the same samples",
          js["SAMPLE_IDS"] == conv["SAMPLE_IDS"])
    check("no duplicate sample ids", len(set(js["SAMPLE_IDS"])) == len(js["SAMPLE_IDS"]))

    print("\nimage files")
    for kind in KINDS:
        d = os.path.join(IMAGES, kind)
        missing = [s for s in js["SAMPLE_IDS"]
                   if not os.path.exists(os.path.join(d, f"{s}.png"))]
        orphan = ([f[:-4] for f in os.listdir(d) if f.endswith(".png")
                   and f[:-4] not in set(js["SAMPLE_IDS"])] if os.path.isdir(d) else [])
        check(f"{kind}: every listed sample has a PNG", not missing,
              f"missing {len(missing)}: {missing[:3]}")
        check(f"{kind}: no orphaned PNGs", not orphan,
              f"orphaned {len(orphan)}: {orphan[:3]}")

    print("\ntraining metrics")
    check("epoch count matches", len(js["EPOCHS"]) == len(api["TRAINING_METRICS"]["epochs"]))
    check("epochs match", js["EPOCHS"] == api["TRAINING_METRICS"]["epochs"])
    for py_key, js_key in METRIC_ALIASES.items():
        check(f"{js_key} matches api/main.py",
              js["TRAINING_METRICS"][js_key] == api["TRAINING_METRICS"][py_key])

    print("\nmask pixels")
    try:
        from PIL import Image
    except ImportError:
        skip("mask colours and class shares", "Pillow not installed")
    else:
        allowed = {tuple(hex_to_rgb(c["color"])) for c in js["CLASS_LEGEND"]}
        totals = {c["id"]: 0 for c in js["CLASS_LEGEND"]}
        pixels = 0
        stray = set()
        by_hex = {tuple(hex_to_rgb(c["color"])): c["id"] for c in js["CLASS_LEGEND"]}
        for kind in ("labels", "predictions"):
            for sid in js["SAMPLE_IDS"]:
                p = os.path.join(IMAGES, kind, f"{sid}.png")
                if not os.path.exists(p):
                    continue
                im = Image.open(p).convert("RGB")
                for count, colour in im.getcolors(maxcolors=1 << 24) or []:
                    if colour not in allowed:
                        stray.add(colour)
                    elif kind == "labels":
                        totals[by_hex[colour]] += count
                if kind == "labels":
                    pixels += im.width * im.height

        check("masks contain only the declared class colours", not stray,
              f"found {sorted(stray)[:4]}")

        if pixels:
            for cid, declared in sorted(js["CLASS_SHARE"].items(), key=lambda kv: int(kv[0])):
                actual = totals[int(cid)] / pixels * 100
                check(
                    f"class {cid} share ~{declared}% matches the masks ({actual:.1f}%)",
                    abs(actual - declared) <= 1.0,
                    f"declared {declared}%, measured {actual:.1f}%",
                )
            check("class shares sum to 100",
                  sum(js["CLASS_SHARE"].values()) == 100)

    print()
    if failures:
        print(f"FAILED: {len(failures)} check(s) — {', '.join(failures[:3])}"
              + (" …" if len(failures) > 3 else ""))
        return 1
    note = f" ({len(skipped)} skipped)" if skipped else ""
    print(f"All checks passed{note}.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
