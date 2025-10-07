from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from geoalchemy2.shape import from_shape
from shapely.geometry import Point

from ...database import get_db
from ... import models, schemas

router = APIRouter(prefix="/encounters", tags=["encounters"])


@router.post("", response_model=schemas.Encounter, status_code=201)
def create_encounter(payload: schemas.EncounterCreate, db: Session = Depends(get_db)):
    person = db.query(models.Person).filter(models.Person.id == payload.personId).first()
    if not person:
        raise HTTPException(status_code=404, detail="Migrant not found")
    if person.consent_granted is False:
        raise HTTPException(status_code=403, detail="Consent not granted")

    encounter = models.Encounter(
        person_id=payload.personId,
        encountered_at=payload.encounteredAt,
        facility=payload.facility,
        encounter_type=payload.encounterType,
        provider_name=payload.providerName,
        temperature_c=payload.temperatureC,
        heart_rate_bpm=payload.heartRateBpm,
        systolic_bp_mmhg=payload.systolicBpMmhg,
        diastolic_bp_mmhg=payload.diastolicBpMmhg,
        oxygen_saturation_pct=payload.oxygenSaturationPct,
    )

    if payload.geo:
        encounter.latitude = payload.geo.lat
        encounter.longitude = payload.geo.lng
        point = Point(payload.geo.lng, payload.geo.lat)
        encounter.location = from_shape(point, srid=4326)

    db.add(encounter)
    db.commit()
    db.refresh(encounter)

    return _encounter_to_schema(encounter)


@router.get("/by-person/{person_id}")
def list_encounters(person_id, db: Session = Depends(get_db)):
    encounters = (
        db.query(models.Encounter)
        .filter(models.Encounter.person_id == person_id)
        .order_by(models.Encounter.encountered_at.desc())
        .limit(100)
        .all()
    )
    return [_encounter_to_schema(e) for e in encounters]


def _encounter_to_schema(e: models.Encounter) -> schemas.Encounter:
    geo = None
    if e.latitude is not None and e.longitude is not None:
        geo = schemas.Geo(lat=float(e.latitude), lng=float(e.longitude))

    return schemas.Encounter(
        id=e.id,
        personId=e.person_id,
        encounteredAt=e.encountered_at,
        facility=e.facility,
        encounterType=e.encounter_type,
        providerName=e.provider_name,
        temperatureC=e.temperature_c,
        heartRateBpm=e.heart_rate_bpm,
        systolicBpMmhg=e.systolic_bp_mmhg,
        diastolicBpMmhg=e.diastolic_bp_mmhg,
        oxygenSaturationPct=e.oxygen_saturation_pct,
        geo=geo,
    )
