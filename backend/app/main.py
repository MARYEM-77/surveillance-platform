import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.alert import Alert, AlertCreate
from app.crud.alert import create_alert, get_alerts

from app.crud.alert import count_alerts_by_type
from fastapi.middleware.cors import CORSMiddleware 
from app.crud.alert import get_delta_by_type
from fastapi import Query

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # ou ["*"] pour test
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/alerts/", response_model=Alert)
def add_alert(alert: AlertCreate, db: Session = Depends(get_db)):
    return create_alert(db, alert)

@app.get("/alerts/", response_model=list[Alert])
def read_alerts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return get_alerts(db, skip=skip, limit=limit)

#^partie jihane 

@app.get("/alerts/stats/")
def get_alert_stats(db: Session = Depends(get_db)):
    return count_alerts_by_type(db)

@app.get("/alerts/delta/")
def get_alerts_delta(interval: str = Query("jour"), db: Session = Depends(get_db)):
    return get_delta_by_type(db, interval)