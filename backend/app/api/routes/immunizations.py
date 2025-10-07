from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ... import models, schemas

router = APIRouter(prefix="/immunizations", tags=["immunizations"])


@router.post("", response_model=schemas.Immunization, status_code=201)
def create_immunization(payload: schemas.ImmunizationCreate, db: Session = Depends(get_db)):
    person = db.query(models.Person).filter(models.Person.id == payload.personId).first()
    if not person:
        raise HTTPException(status_code=404, detail="Migrant not found")
    if person.consent_granted is False:
        raise HTTPException(status_code=403, detail="Consent not granted")

    immunization = models.Immunization(
        person_id=payload.personId,
        vaccine_code=payload.vaccineCode,
        dose_number=payload.doseNumber,
        lot_number=payload.lotNumber,
        administered_at=payload.administeredAt,
        facility=payload.facility,
    )

    db.add(immunization)
    db.commit()
    db.refresh(immunization)

    return _to_schema(immunization)


@router.get("/by-person/{person_id}")
def list_immunizations(person_id, db: Session = Depends(get_db)):
    ims = (
        db.query(models.Immunization)
        .filter(models.Immunization.person_id == person_id)
        .order_by(models.Immunization.administered_at.desc())
        .limit(100)
        .all()
    )
    return [_to_schema(i) for i in ims]


def _to_schema(i: models.Immunization) -> schemas.Immunization:
    return schemas.Immunization(
        id=i.id,
        personId=i.person_id,
        vaccineCode=i.vaccine_code,
        doseNumber=i.dose_number,
        lotNumber=i.lot_number,
        administeredAt=i.administered_at,
        facility=i.facility,
    )
