import sys
from fastapi.staticfiles import StaticFiles
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.schemas.alert import Alert, AlertCreate
from app.crud.alert import create_alert, get_alerts
from typing import Optional
from datetime import datetime, timedelta
from datetime import date
from app.crud.alert import count_alerts_by_type
from fastapi.middleware.cors import CORSMiddleware 
from app.crud.alert import get_delta_by_type
from fastapi import Query
from app.crud.alert import get_daily_kpis
from app.crud.alert import get_interval_stats, get_interval_percentages
from app.crud.alert import get_delta_by_status
from app.crud.alert import get_ALLalerts

from pydantic import BaseModel
from typing import Optional

import sqlite3

from fastapi import HTTPException


app = FastAPI()

EXTERNAL_MEDIA_DIR = "C:/Users/Meryem/Models/Models/output"
EXTERNAL_MEDIA_URL = "/external-media"
print("== Vérification du dossier media ==")
print("EXISTS ?", os.path.exists(EXTERNAL_MEDIA_DIR))  # Doit être True
print("FILES :", os.listdir(EXTERNAL_MEDIA_DIR))       # Doit contenir les fichiers image

app.mount(EXTERNAL_MEDIA_URL, StaticFiles(directory=EXTERNAL_MEDIA_DIR), name="external-media")
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

#^partie jihane corrige par yassmine

@app.get("/alerts/stats/")
def get_alert_stats(interval: str = Query(None), db: Session = Depends(get_db)):
    return count_alerts_by_type(db, interval)


@app.get("/alerts/delta/")
def get_alerts_delta(interval: str = Query("jour"), db: Session = Depends(get_db)):
    return get_delta_by_type(db, interval)

#récupérer les alertes non traitées

from app.crud.alert import get_unresolved_alerts  

@app.get("/alerts/unresolved", response_model=list[Alert])
def read_unresolved_alerts(db: Session = Depends(get_db)):
    return get_unresolved_alerts(db)


#rendre les alertes non traitées => traitées 

class AlertUpdate(BaseModel):
    statut: Optional[str] = "Traité"

@app.patch("/alerts/{alert_id}/")
def update_alert_status(alert_id: str, update: AlertUpdate):
    conn = sqlite3.connect("alerts.db")
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE alert_id = ?", (alert_id,))
    result = cursor.fetchone()
    if not result:
        conn.close()
        raise HTTPException(status_code=404, detail="Alerte non trouvée")

    cursor.execute("UPDATE alerts SET statut = ? WHERE alert_id = ?", (update.statut, alert_id))
    conn.commit()
    conn.close()
    return {"message": f"Alerte {alert_id} marquée comme {update.statut}"}


#Partie MAryem



@app.get("/alerts/kpis")
def get_all_kpis(db: Session = Depends(get_db)):
    return get_daily_kpis(db)

@app.get("/alerts/interval-stats/")
def get_alert_stats_by_interval(interval: str = Query("jour"), db: Session = Depends(get_db)):
    return get_interval_stats(db, interval)

@app.get("/alerts/pourcentages/")
def get_alert_percentages(interval: str = Query("jour"), db: Session = Depends(get_db)):
    return get_interval_percentages(db, interval)


@app.get("/alerts/status-delta/")
def alert_status_delta(interval: str = Query(..., enum=["jour", "semaine", "mois"]), db: Session = Depends(get_db)):
    return get_delta_by_status(db, interval)

#partie yassmine: route pour les alertes par heure
from app.crud.alert import get_alerts_by_hour

@app.get("/alerts/by-hour/")
def alerts_by_hour(db: Session = Depends(get_db)):
    return get_alerts_by_hour(db)

# route pour les alertes par jour
from app.crud.alert import get_alerts_by_weekday

@app.get("/alerts/by-weekday/")
def alerts_by_weekday(db: Session = Depends(get_db)):
    return get_alerts_by_weekday(db)

# route pour les alertes par mois
from app.crud.alert import get_alerts_by_day_of_month

@app.get("/alerts/by-day-of-month/")
def alerts_by_day_of_month(db: Session = Depends(get_db)):
    return get_alerts_by_day_of_month(db)




#PArtie MAryem (2eme page)
@app.get("/alerts/AllaLerts")
def read_alerts(
    db: Session = Depends(get_db),
    search: Optional[str] = Query(None),
    type: Optional[str] = Query(None),
    statut: Optional[str] = Query(None),
    date_from: Optional[date] = Query(None),
    date_to: Optional[date] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
):
    results, total = get_ALLalerts(
        db=db,
        search=search,
        type=type,
        statut=statut,
        date_from=date_from,
        date_to=date_to,
        skip=skip,
        limit=limit,
    )

    return {
        "data": results,
        "total": total,
        "skip": skip,
        "limit": limit,
    }

    
#route pour télécharger rapport
from fastapi.responses import FileResponse
from app.utils.generate_alert_report import generate_report_by_id

@app.get("/alerts/{alert_id}/pdf")
def download_alert_report(alert_id: str):
    path = generate_report_by_id(alert_id)
    if not path:
        raise HTTPException(status_code=404, detail="Rapport introuvable")
    return FileResponse(path, filename=f"rapport_{alert_id}.pdf", media_type="application/pdf")