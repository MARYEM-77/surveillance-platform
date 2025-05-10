from sqlalchemy.orm import Session
from app.db.models.alert import Alert as AlertModel
from app.schemas.alert import AlertCreate
from sqlalchemy import func
from datetime import datetime, timedelta
from datetime import date

from collections import Counter

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


#code MAryem 

def get_daily_kpis(db: Session):
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    tomorrow = today + timedelta(days=1)

    # Traitement aujourd’hui
    treated_today = db.query(func.count(AlertModel.alert_id)).filter(
        AlertModel.timestamp >= today,
        AlertModel.timestamp < tomorrow,
        AlertModel.statut == "Traité"
    ).scalar()

    untreated_today = db.query(func.count(AlertModel.alert_id)).filter(
        AlertModel.timestamp >= today,
        AlertModel.timestamp < tomorrow,
        AlertModel.statut == "Non traité"
    ).scalar()

    total_today = treated_today + untreated_today

    # Traitement hier
    treated_yesterday = db.query(func.count(AlertModel.alert_id)).filter(
        AlertModel.timestamp >= yesterday,
        AlertModel.timestamp < today,
        AlertModel.statut == "Traité"
    ).scalar()

    untreated_yesterday = db.query(func.count(AlertModel.alert_id)).filter(
        AlertModel.timestamp >= yesterday,
        AlertModel.timestamp < today,
        AlertModel.statut == "Non traité"
    ).scalar()

    return {
        "traites": {
            "count": treated_today,
            "delta": treated_today - treated_yesterday,
            "percentage": round((treated_today / total_today) * 100, 2) if total_today else 0
        },
        "non_traites": {
            "count": untreated_today,
            "delta": untreated_yesterday - untreated_today,
            "percentage": round((untreated_today / total_today) * 100, 2) if total_today else 0
        },
        "total": total_today
    }

###nv code 


def get_date_range(interval: str):
    today = date.today()

    if interval == "jour":
        current_start = today
        previous_start = today - timedelta(days=1)
        previous_end = today - timedelta(days=1)
    elif interval == "semaine":
        current_start = today - timedelta(days=today.weekday())
        previous_start = current_start - timedelta(days=7)
        previous_end = current_start - timedelta(days=1)
    elif interval == "mois":
        current_start = today.replace(day=1)
        previous_start = (current_start - timedelta(days=1)).replace(day=1)
        previous_end = current_start - timedelta(days=1)
    else:
        raise ValueError("Intervalle invalide")

    return current_start, previous_start, previous_end



def get_interval_stats(db: Session, interval: str):
    from app.crud.alert import get_date_range
    current_start, _, _ = get_date_range(interval)
    incidents = db.query(AlertModel).filter(AlertModel.timestamp >= current_start).all()
    counter = Counter(i.statut for i in incidents)
    total = len(incidents)
    return {
        "traite": counter.get("Traité", 0),
        "non_traite": counter.get("Non traité", 0),
        "total": total
    }

def get_interval_percentages(db: Session, interval: str):
    from app.crud.alert import get_date_range
    current_start, _, _ = get_date_range(interval)
    incidents = db.query(AlertModel).filter(AlertModel.timestamp >= current_start).all()
    total = len(incidents)
    counter = Counter(i.statut for i in incidents)
    traite = counter.get("Traité", 0)
    non_traite = counter.get("Non traité", 0)

    return {
        "traite": round((traite / total) * 100, 1) if total else 0,
        "non_traite": round((non_traite / total) * 100, 1) if total else 0
    }

def get_delta_by_status(db: Session, interval: str):
    current_start, previous_start, previous_end = get_date_range(interval)

    def get_counts(start_date, end_date):
        # Définir les bornes avec précision pour inclure toute la journée
        start_datetime = datetime.combine(start_date, datetime.min.time())
        end_datetime = datetime.combine(end_date + timedelta(days=1), datetime.min.time())
        
        # Récupération du nombre d'alertes groupées par statut dans l'intervalle
        return dict(
            db.query(AlertModel.statut, func.count(AlertModel.alert_id))
            .filter(AlertModel.timestamp >= start_datetime,
                    AlertModel.timestamp < end_datetime)
            .group_by(AlertModel.statut)
            .all()
        )

    today = date.today()
    current_counts = get_counts(current_start, today)
    previous_counts = get_counts(previous_start, previous_end)

    # Union des statuts rencontrés sur les deux périodes
    all_statuts = set(current_counts) | set(previous_counts)

    # Calcul des deltas pour chaque statut
    delta = {
        statut: current_counts.get(statut, 0) - previous_counts.get(statut, 0)
        for statut in all_statuts
    }

    return delta