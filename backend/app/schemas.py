from __future__ import annotations

import uuid
from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, Field


# ----------------------
# Shared / common models
# ----------------------
class Name(BaseModel):
    given: str
    family: Optional[str] = None
    localScript: Optional[str] = None


class Geo(BaseModel):
    lat: float
    lng: float


class Origin(BaseModel):
    state: Optional[str] = None
    district: Optional[str] = None


class Residence(BaseModel):
    address: Optional[str] = None
    geo: Optional[Geo] = None


# ----------------------
# Migrant (Person)
# ----------------------
class MigrantCreate(BaseModel):
    name: Name
    dateOfBirth: Optional[date] = None
    sex: Optional[str] = None
    phones: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    origin: Optional[Origin] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    residence: Optional[Residence] = None
    consentGranted: bool = True


class Migrant(BaseModel):
    id: uuid.UUID
    name: Name
    dateOfBirth: Optional[date] = None
    sex: Optional[str] = None
    phones: Optional[List[str]] = None
    languages: Optional[List[str]] = None
    origin: Optional[Origin] = None
    occupation: Optional[str] = None
    employer: Optional[str] = None
    residence: Optional[Residence] = None
    consentGranted: bool = True

    class Config:
        from_attributes = True


# ----------------------
# Encounter
# ----------------------
class EncounterCreate(BaseModel):
    personId: uuid.UUID
    encounteredAt: Optional[datetime] = None
    facility: Optional[str] = None
    encounterType: Optional[str] = None
    providerName: Optional[str] = None

    temperatureC: Optional[float] = None
    heartRateBpm: Optional[int] = None
    systolicBpMmhg: Optional[int] = None
    diastolicBpMmhg: Optional[int] = None
    oxygenSaturationPct: Optional[int] = None

    geo: Optional[Geo] = None


class Encounter(BaseModel):
    id: uuid.UUID
    personId: uuid.UUID
    encounteredAt: datetime
    facility: Optional[str] = None
    encounterType: Optional[str] = None
    providerName: Optional[str] = None

    temperatureC: Optional[float] = None
    heartRateBpm: Optional[int] = None
    systolicBpMmhg: Optional[int] = None
    diastolicBpMmhg: Optional[int] = None
    oxygenSaturationPct: Optional[int] = None

    geo: Optional[Geo] = None

    class Config:
        from_attributes = True


# ----------------------
# Immunization
# ----------------------
class ImmunizationCreate(BaseModel):
    personId: uuid.UUID
    vaccineCode: str
    doseNumber: Optional[int] = None
    lotNumber: Optional[str] = None
    administeredAt: Optional[datetime] = None
    facility: Optional[str] = None


class Immunization(BaseModel):
    id: uuid.UUID
    personId: uuid.UUID
    vaccineCode: str
    doseNumber: Optional[int] = None
    lotNumber: Optional[str] = None
    administeredAt: datetime
    facility: Optional[str] = None

    class Config:
        from_attributes = True
