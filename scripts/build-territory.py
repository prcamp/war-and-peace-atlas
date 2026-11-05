"""Generate the Atlas's compact historical map from a Cliopatria GeoJSON zip.

Usage: python scripts/build-territory.py cliopatria.geojson.zip
Requires Shapely. Source and reconstruction notes: CAMPAIGN_SOURCES.md.
"""
import json
import sys
from pathlib import Path
from zipfile import ZipFile

from shapely import make_valid
from shapely.geometry import box, shape
from shapely.ops import unary_union

with ZipFile(sys.argv[1]) as archive:
    features = json.load(archive.open(archive.namelist()[0]))["features"]

europe = box(-25, 33, 59, 72)
features = [
    f for f in features if f["geometry"]
    and f["properties"]["Type"] == "POLITY"
    and not f["properties"]["Name"].startswith("(")
    and f["properties"]["FromYear"] <= 1820
    and f["properties"]["ToYear"] >= 1790
]
geometries = []
indices = {}


def year_rows(year):
    return [f for f in features if f["properties"]["FromYear"] <= year <= f["properties"]["ToYear"]]


def geometry(feature):
    return make_valid(shape(feature["geometry"])).intersection(europe)


def polity(year, name):
    return unary_union([geometry(f) for f in year_rows(year) if f["properties"]["Name"] == name])


def polygons(geom):
    if geom.geom_type == "Polygon":
        yield geom
    elif hasattr(geom, "geoms"):
        for item in geom.geoms:
            yield from polygons(item)


def register(geom):
    rings = []
    for poly in polygons(geom.simplify(.08, preserve_topology=True)):
        if poly.area < .012:
            continue
        for ring in (poly.exterior, *poly.interiors):
            points = [[round(x, 3), round(y, 3)] for x, y in ring.coords[:-1]]
            if len({tuple(p) for p in points}) >= 3:
                rings.append(points)
    if not rings:
        return None
    key = json.dumps(rings, separators=(",", ":"))
    if key not in indices:
        indices[key] = len(geometries)
        geometries.append(rings)
    return indices[key]


france = {y: polity(y, "First French Empire") for y in [1805, 1806, 1807, 1809, 1811, 1812]}
france_1790 = polity(1790, "Kingdom of France")
spain = polity(1805, "Kingdom of Spain")
portugal = polity(1805, "Kingdom of Portugal")
iberia = spain.union(portugal)
austria_1805 = polity(1805, "Habsburg Monarchy")
austria_1806 = polity(1806, "Austrian Empire")
prussia_1806 = polity(1806, "Kingdom of Prussia")
russia_1811 = polity(1811, "Russian Empire")

# The source combines imperial possessions and military occupation in its
# France polygons. Recover the underlying sovereign borders and separate fills.
austria_occupation = france[1805].intersection(austria_1806).difference(france[1806])
prussia_occupation = france[1807].intersection(prussia_1806).difference(france[1806])
russia_occupation = france[1812].intersection(russia_1811)
hanover = france[1805].intersection(box(7.4, 51.84, 11.5, 54))
early_france = france[1805].difference(austria_occupation.union(hanover))
late_france = france[1812].difference(iberia.union(russia_occupation))
war_iberia = {y: france[y].intersection(iberia) for y in [1809, 1811, 1812]}


def snapshot(year, label, empire, overrides, occupied=None):
    excluded = set(overrides) | {"First French Empire"}
    rows = [
        (f["properties"]["Name"], geometry(f))
        for f in year_rows(year) if f["properties"]["Name"] not in excluded
    ]
    rows.extend(overrides.items())
    if not empire.is_empty:
        rows.append(("French Empire", empire))
    rows.sort(key=lambda row: row[1].area, reverse=True)
    borders = [[name, index] for name, geom in rows if (index := register(geom)) is not None]
    return {
        "label": label, "borders": borders,
        "acquired": register(empire.difference(france_1790)),
        "occupied": register(occupied) if occupied is not None else None,
    }


def restored_prussia(year, empire):
    transfers = unary_union([
        polity(year, name) for name in [
            "Duchy of Warsaw", "Kingdom of Westphalia", "Kingdom of Saxony",
            "Confederation of the Rhine", "Grand Duchy of Berg",
        ]
    ])
    # The dataset omits Prussia proper in these years. Use its prewar shape,
    # the territories ceded at Tilsit, and the later French annexation footprint.
    return prussia_1806.intersection(box(10.5, 47, 27, 57)).difference(transfers.union(empire))


snapshots = {
    "1805": snapshot(1805, "1805", early_france, {
        "Habsburg Monarchy": austria_1805.union(austria_occupation),
        "Electorate of Hanover": hanover,
    }, hanover),
    "1806": snapshot(1806, "1806–early 1807", france[1806], {}),
}
for key, year, label, empire, occupied in [
    ("tilsit", 1809, "After Tilsit · 1807", france[1806], None),
    ("1809", 1809, "1809–10", france[1809].difference(iberia.union(austria_1806)), war_iberia[1809]),
    ("1811", 1811, "1811", late_france, war_iberia[1811]),
    ("1812", 1812, "1812", late_france, war_iberia[1812]),
]:
    overrides = {"Kingdom of Prussia": restored_prussia(year, empire)}
    if key == "tilsit":
        overrides.update({"Swedish Empire": polity(1807, "Swedish Empire"),
                          "Russian Empire": polity(1807, "Russian Empire"),
                          "Kingdom of Spain": spain, "Kingdom of Portugal": portugal})
    if year >= 1809:
        overrides.update({"Kingdom of Spain": spain, "Kingdom of Portugal": portugal})
    if year == 1812:
        overrides["Russian Empire"] = polity(1812, "Russian Empire").union(russia_occupation).union(polity(1812, "Bessarabia"))
        overrides["Bessarabia"] = polity(1812, "Bessarabia").difference(polity(1812, "Bessarabia"))
    snapshots[key] = snapshot(year, label, empire, overrides, occupied)
snapshots["1820"] = snapshot(1820, "Postwar Europe · c. 1820", france_1790.difference(france_1790), {})

# Gates match the existing chapter evidence. Cut the sourced peak occupation
# footprint at a broad eastward limit for each phase, never buffer a route.
campaigns = {}
for footprint, stages in [
    (austria_occupation, [(35, 13.2), (37, 14.6), (39, 16.55), (43, 16.75), (62, 17.0)]),
    (prussia_occupation, [(94, 21.08), (102, 21.42), (104, 22.1)]),
    (russia_occupation, [(170, 24.25), (173, 25.45), (182, 29.86),
                        (193, 30.45), (195, 32.18), (210, 36.1),
                        (249, 37.52), (256, 38), (293, 37.4), (295, 37.05),
                        (298, 35.5), (299, 34.42), (315, 32.02), (317, 30.5),
                        (328, 22)]),
]:
    reached = footprint.intersection(box(-25, 33, -24, 72))
    for chapter, longitude in stages:
        held = footprint.intersection(box(-25, 33, longitude, 72))
        reached = reached.union(held)
        campaigns[chapter] = {"held": register(held), "earlier": register(reached.difference(held))}

output = {"geometries": geometries, "snapshots": snapshots, "campaigns": campaigns}
Path("dist/territory-data.json").write_text(json.dumps(output, ensure_ascii=False, separators=(",", ":")) + "\n")
