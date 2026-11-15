"""Clip FAO's public GAEZ v5 COGs for the Rwanda pilot bounding box.

Requires rasterio and numpy. Dataset identifiers were checked against FAO's
RES05 catalogue: https://data.apps.fao.org/catalog/dataset/514c92d5-9e01-4c70-814a-80ea1ca9fe6a/resource/768b08ad-be9c-427a-84be-3a3d6dd7835a/download/_readme_res05.xlsx
The rectangular clip is not an administrative boundary.
"""
import base64
import concurrent.futures
import json
import zlib
from pathlib import Path

import numpy as np
import rasterio
from rasterio.windows import from_bounds

BASE = "https://storage.googleapis.com/fao-gismgr-gaez-v5-data/DATA/GAEZ-V5/MAPSET/RES05-SXX30AS"
CROPS = {"maize": "MZE", "common-beans": "PHB", "sorghum": "SRG", "soybeans": "SOY", "groundnuts": "GRD"}
SCENARIOS = {"rainfed": "LRLM", "irrigated": "LILM"}
BOUNDS = (28.8, -3.0, 31.0, -1.0)

def clip(item):
    crop, code, scenario, management = item
    dataset = f"GAEZ-V5.RES05-SXX30AS.HP0120.AGERA5.HIST.{code}.{management}"
    url = f"{BASE}/{dataset}.tif"
    with rasterio.Env(GDAL_DISABLE_READDIR_ON_OPEN="EMPTY_DIR"):
        with rasterio.open(url) as source:
            if source.crs.to_epsg() != 4326 or source.count != 1:
                raise ValueError(f"Unexpected raster format for {dataset}")
            window = from_bounds(*BOUNDS, source.transform).round_offsets().round_lengths()
            grid = source.read(1, window=window).astype("<i2")
            transform = source.window_transform(window)
            return f"{crop}:{scenario}", {"dataset": dataset, "url": url, "nodata": int(source.nodata), "width": grid.shape[1], "height": grid.shape[0], "west": transform.c, "north": transform.f, "xres": transform.a, "yres": transform.e, "encoding": "zlib-base64-int16le", "values": base64.b64encode(zlib.compress(grid.tobytes(), 9)).decode("ascii")}

def main():
    jobs = [(crop, code, scenario, management) for crop, code in CROPS.items() for scenario, management in SCENARIOS.items()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=1) as pool:
        layers = dict(pool.map(clip, jobs))
    out = {"source": "FAO GAEZ v5", "variable": "RES05-SXX30AS", "baseline": "2001–2020", "climate": "AgERA5", "resolution": "30 arc-seconds", "management": "low input", "layers": layers}
    path = Path(__file__).resolve().parents[1] / "lib/environment/data/gaez-rwanda.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(out, separators=(",", ":")), encoding="utf8")
    print(f"Wrote {len(layers)} verified layers to {path} ({path.stat().st_size} bytes)")

if __name__ == "__main__":
    main()
