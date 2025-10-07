from __future__ import annotations

import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from ...database import get_db
from ... import models, schemas

router = APIRouter(prefix="/migrants", tags=["migrants"])


@router.post("", response_model=schemas.Migrant, status_code=201)
def create_migrant(payload: schemas.MigrantCreate, db: Session = Depends(get_db)):
    person = models.Person(
        given_name=payload.name.given,
        family_name=payload.name.family,
        local_script_name=payload.name.localScript,
        date_of_birth=payload.dateOfBirth,
        sex=payload.sex,
        phones=payload.phones,
        languages=payload.languages,
        origin_state=payload.origin.state if payload.origin else None,
        origin_district=payload.origin.district if payload.origin else None,
        occupation=payload.occupation,
        employer=payload.employer,
        residence_address=payload.residence.address if payload.residence else None,
        consent_granted=payload.consentGranted,
    )

    if payload.residence and payload.residence.geo:
        # Note: storing lat/lng separately; geometry is set in Encounter for geospatial
        pass

    db.add(person)
    db.commit()
    db.refresh(person)

    return _person_to_schema(person)


@router.get("/{person_id}", response_model=schemas.Migrant)
def get_migrant(person_id: uuid.UUID, db: Session = Depends(get_db)):
    person = db.query(models.Person).filter(models.Person.id == person_id).first()
    if not person:
        raise HTTPException(status_code=404, detail="Migrant not found")
    return _person_to_schema(person)


@router.get("", response_model=List[schemas.Migrant])
def search_migrants(
    q: Optional[str] = Query(None, description="Search by name"),
    phone: Optional[str] = Query(None, description="Search by phone exact match"),
    db: Session = Depends(get_db),
):
    query = db.query(models.Person)

    if phone:
        query = query.filter(models.Person.phones.contains([phone]))
    if q:
        like = f"%{q.lower()}%"
        query = query.filter(models.Person.given_name.ilike(like) | models.Person.family_name.ilike(like))

    persons = query.order_by(models.Person.created_at.desc()).limit(50).all()
    return [_person_to_schema(p) for p in persons]


def _person_to_schema(person: models.Person) -> schemas.Migrant:
    return schemas.Migrant(
        id=person.id,
        name=schemas.Name(
            given=person.given_name,
            family=person.family_name,
            localScript=person.local_script_name,
        ),
        dateOfBirth=person.date_of_birth,
        sex=person.sex,
        phones=person.phones,
        languages=person.languages,
        origin=schemas.Origin(state=person.origin_state, district=person.origin_district),
        occupation=person.occupation,
        employer=person.employer,
        residence=schemas.Residence(address=person.residence_address),
        consentGranted=person.consent_granted,
    )
