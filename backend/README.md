## Kerala Migrant Health Backend (FastAPI)

Run locally with a Postgres DB (with PostGIS).

### Environment

Create `.env` in `backend/` if you want to override defaults:

```
APP_NAME="Kerala Migrant Health Backend"
ENVIRONMENT=development
DATABASE_URL=postgresql+psycopg2://postgres:postgres@localhost:5432/migrant_health
```

### Run

```
python -m uvicorn app.main:app --reload --port 8000
```

### API
- `POST /api/v1/migrants` create
- `GET /api/v1/migrants?q=rahim&phone=+91...` search
- `GET /api/v1/migrants/{id}` get by id
- `POST /api/v1/encounters` create
- `GET /api/v1/encounters/by-person/{person_id}` list
- `POST /api/v1/immunizations` create
- `GET /api/v1/immunizations/by-person/{person_id}` list
