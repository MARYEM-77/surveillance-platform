from sqlalchemy.orm import Session
from app.db.models.alert import Alert as AlertModel
from app.schemas.alert import AlertCreate
from sqlalchemy import func
from datetime import datetime, timedelta

def create_alert(db: Session, alert: AlertCreate):
    db_alert = AlertModel(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alerts(db: Session, skip: int = 0, limit: int = 10):
    return db.query(AlertModel).offset(skip).limit(limit).all()

#code pour partie jihane

#compter le nbr d'alertes selon le type 
def count_alerts_by_type(db: Session):
    results = db.query(AlertModel.detection_type, func.count(AlertModel.alert_id)).group_by(AlertModel.detection_type).all()
    stats = {type_: count for type_, count in results}
    stats["total"] = sum(stats.values())
    return stats

#code pour retourner combien d'alertes depuis hier; semaine ; mois  

def get_delta_by_type(db: Session, interval: str):
    today = datetime.now().date()

    if interval == "jour":
        current_start = today
        previous_start = today - timedelta(days=1)
    elif interval == "semaine":
        current_start = today - timedelta(days=today.weekday())  # lundi de cette semaine
        previous_start = current_start - timedelta(days=7)
    elif interval == "mois":
        current_start = today.replace(day=1)
        previous_start = (current_start - timedelta(days=1)).replace(day=1)
    else:
        raise ValueError("Interval non supporté")

    def get_counts(start: datetime, end: datetime):
        return dict(
            db.query(AlertModel.detection_type, func.count(AlertModel.alert_id))
            .filter(AlertModel.timestamp >= start, AlertModel.timestamp < end)
            .group_by(AlertModel.detection_type)
            .all()
        )

    # Calcul des bornes
    if interval == "jour":
        current_end = current_start + timedelta(days=1)
        previous_end = previous_start + timedelta(days=1)
    elif interval == "semaine":
        current_end = current_start + timedelta(days=7)
        previous_end = previous_start + timedelta(days=7)
    elif interval == "mois":
        if current_start.month == 12:
            current_end = current_start.replace(year=current_start.year + 1, month=1)
        else:
            current_end = current_start.replace(month=current_start.month + 1)
        if previous_start.month == 12:
            previous_end = previous_start.replace(year=previous_start.year + 1, month=1)
        else:
            previous_end = previous_start.replace(month=previous_start.month + 1)

    current_counts = get_counts(current_start, current_end)
    previous_counts = get_counts(previous_start, previous_end)

    all_types = set(current_counts) | set(previous_counts)
    delta = {
        type_: current_counts.get(type_, 0) - previous_counts.get(type_, 0)
        for type_ in all_types
    }
    return delta