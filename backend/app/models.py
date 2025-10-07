from __future__ import annotations

import uuid
from datetime import date, datetime

from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Float,
    ForeignKey,
    Integer,
    Numeric,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import relationship
from geoalchemy2 import Geometry

from .database import Base


class Person(Base):
    __tablename__ = "persons"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    given_name = Column(String(100), nullable=False)
    family_name = Column(String(100), nullable=True)
    local_script_name = Column(String(200), nullable=True)

    date_of_birth = Column(Date, nullable=True)
    sex = Column(String(16), nullable=True)

    phones = Column(JSONB, nullable=True)  # list[str]
    languages = Column(JSONB, nullable=True)  # list[str]

    origin_state = Column(String(100), nullable=True)
    origin_district = Column(String(100), nullable=True)

    occupation = Column(String(150), nullable=True)
    employer = Column(String(200), nullable=True)

    residence_address = Column(Text, nullable=True)

    consent_granted = Column(Boolean, nullable=False, default=True)

    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    updated_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), onupdate=func.now())

    encounters = relationship("Encounter", back_populates="person", cascade="all, delete-orphan")
    immunizations = relationship("Immunization", back_populates="person", cascade="all, delete-orphan")


class Encounter(Base):
    __tablename__ = "encounters"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)

    encountered_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    facility = Column(String(200), nullable=True)
    encounter_type = Column(String(100), nullable=True)
    provider_name = Column(String(200), nullable=True)

    temperature_c = Column(Float, nullable=True)
    heart_rate_bpm = Column(Integer, nullable=True)
    systolic_bp_mmhg = Column(Integer, nullable=True)
    diastolic_bp_mmhg = Column(Integer, nullable=True)
    oxygen_saturation_pct = Column(Integer, nullable=True)

    latitude = Column(Numeric(9, 6), nullable=True)
    longitude = Column(Numeric(9, 6), nullable=True)
    location = Column(Geometry(geometry_type="POINT", srid=4326), nullable=True)

    person = relationship("Person", back_populates="encounters")


class Immunization(Base):
    __tablename__ = "immunizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    person_id = Column(UUID(as_uuid=True), ForeignKey("persons.id", ondelete="CASCADE"), nullable=False)

    vaccine_code = Column(String(100), nullable=False)
    dose_number = Column(Integer, nullable=True)
    lot_number = Column(String(100), nullable=True)
    administered_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    facility = Column(String(200), nullable=True)

    person = relationship("Person", back_populates="immunizations")
