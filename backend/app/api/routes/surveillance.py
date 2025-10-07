from __future__ import annotations

from datetime import timedelta, datetime
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from ...database import get_db
from ... import models

router = APIRouter(prefix="/surveillance", tags=["surveillance"])


@router.get("/hotspots")
def hotspots(d: int = Query(7, ge=1, le=90), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """Return GeoJSON FeatureCollection representing encounter density clusters in the last d days."""
    since = datetime.utcnow() - timedelta(days=d)

    # Aggregate encounters by lat/lng rounded to ~1km grid (approx 0.01 degrees)
    lat_bin = func.round(models.Encounter.latitude, 2)
    lng_bin = func.round(models.Encounter.longitude, 2)

    rows = (
        db.query(lat_bin.label("lat"), lng_bin.label("lng"), func.count(models.Encounter.id).label("count"))
        .filter(models.Encounter.encountered_at >= since)
        .filter(models.Encounter.latitude.isnot(None))
        .filter(models.Encounter.longitude.isnot(None))
        .group_by(lat_bin, lng_bin)
        .order_by(func.count(models.Encounter.id).desc())
        .limit(200)
        .all()
    )

    features: List[Dict[str, Any]] = []
    for r in rows:
        features.append(
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [float(r.lng), float(r.lat)]},
                "properties": {"count": int(r.count)},
            }
        )

    return {"type": "FeatureCollection", "features": features}
