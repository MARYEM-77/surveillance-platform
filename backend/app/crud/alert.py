from sqlalchemy.orm import Session
from app.db.models.alert import Alert as AlertModel
from app.schemas.alert import AlertCreate

def create_alert(db: Session, alert: AlertCreate):
    db_alert = AlertModel(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alerts(db: Session, skip: int = 0, limit: int = 10):
    return db.query(AlertModel).offset(skip).limit(limit).all()
