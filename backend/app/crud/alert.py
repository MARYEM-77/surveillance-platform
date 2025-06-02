from sqlalchemy.orm import Session
from app.db.models.alert import Alert as AlertModel
from app.schemas.alert import AlertCreate
from sqlalchemy import func
from datetime import datetime, timedelta
from datetime import date
from typing import Optional
from fastapi.responses import JSONResponse
import os


from collections import Counter


# Chemin local vers le dossier où sont stockées les images
EXTERNAL_MEDIA_DIR = "C:/Users/Meryem/Models/Models/output"
EXTERNAL_MEDIA_URL = "http://localhost:8000/external-media" 

def create_alert(db: Session, alert: AlertCreate):
    db_alert = AlertModel(**alert.dict())
    db.add(db_alert)
    db.commit()
    db.refresh(db_alert)
    return db_alert

def get_alerts(db: Session, skip: int = 0, limit: int = 10):
    return db.query(AlertModel).offset(skip).limit(limit).all()

#code pour partie jihane corrige par yassmine

#compter le nbr d'alertes selon le type 
def count_alerts_by_type(db: Session, interval: str = None):
    query = db.query(AlertModel)

    if interval:
        today = datetime.now().date()
        if interval == "jour":
            start = today
            end = today + timedelta(days=1)
        elif interval == "semaine":
            start = today - timedelta(days=today.weekday())
            end = start + timedelta(days=7)
        elif interval == "mois":
            start = today.replace(day=1)
            if start.month == 12:
                end = start.replace(year=start.year + 1, month=1)
            else:
                end = start.replace(month=start.month + 1)
        else:
            raise ValueError("Interval non supporté")

        query = query.filter(AlertModel.timestamp >= start, AlertModel.timestamp < end)

    results = query.with_entities(
        AlertModel.detection_type, func.count(AlertModel.alert_id)
    ).group_by(AlertModel.detection_type).all()

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


#retourner alertes non traitées
from sqlalchemy import or_


def get_unresolved_alerts(db: Session):
    return db.query(AlertModel).filter(
        or_(AlertModel.statut == None, AlertModel.statut == "Non traité")
    ).all()


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

#partie Yassmine
# get alerts by 2hours
from sqlalchemy import extract
from collections import defaultdict

def get_alerts_by_hour(db: Session):
    today = datetime.now().date()

    results = db.query(
        extract("hour", AlertModel.timestamp).label("hour"),
        AlertModel.detection_type,
        func.count(AlertModel.alert_id)
    ).filter(func.date(AlertModel.timestamp) == today)\
     .group_by("hour", AlertModel.detection_type)\
     .order_by("hour").all()

    # Grouper par tranches de 2 heures
    hours_data = defaultdict(lambda: {"feu": 0, "arme": 0, "criminel": 0})

    for hour, detection_type, count in results:
        two_hour_slot = (int(hour) // 2) * 2  # Ex: 3h → 2h, 5h → 4h
        if detection_type in ["feu", "arme", "criminel"]:
            hours_data[two_hour_slot][detection_type] += count

    formatted_data = []
    for hour in range(0, 24, 2):  # seulement 00, 02, ..., 22
        formatted_data.append({
            "name": f"{hour:02d}:00",
            "feu": hours_data[hour]["feu"],
            "arme": hours_data[hour]["arme"],
            "criminel": hours_data[hour]["criminel"]
        })

    return formatted_data
#get alerts by week

def get_alerts_by_weekday(db: Session):
    today = datetime.now().date()
    start_of_week = today - timedelta(days=today.weekday())  # Lundi de la semaine courante

    results = db.query(
        extract("dow", AlertModel.timestamp).label("weekday"),
        AlertModel.detection_type,
        func.count(AlertModel.alert_id)
    ).filter(func.date(AlertModel.timestamp) >= start_of_week)\
     .filter(func.date(AlertModel.timestamp) <= today)\
     .group_by("weekday", AlertModel.detection_type)\
     .order_by("weekday").all()

    # Adapter au nom des jours (en français ici)
    day_names = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"]
    week_data = defaultdict(lambda: {"feu": 0, "arme": 0, "criminel": 0})

    for weekday, detection_type, count in results:
        day_index = int(weekday)
        if detection_type in ["feu", "arme", "criminel"]:
            week_data[day_index][detection_type] += count

    formatted_data = []
    for i in range(7):
        formatted_data.append({
            "name": day_names[i],
            "feu": week_data[i]["feu"],
            "arme": week_data[i]["arme"],
            "criminel": week_data[i]["criminel"]
        })

    return formatted_data
#get alerts by month
from calendar import monthrange

def get_alerts_by_day_of_month(db: Session):
    today = datetime.now()
    year = today.year
    month = today.month
    num_days = monthrange(year, month)[1]  # nombre de jours dans le mois

    results = db.query(
        extract("day", AlertModel.timestamp).label("day"),
        AlertModel.detection_type,
        func.count(AlertModel.alert_id)
    ).filter(extract("month", AlertModel.timestamp) == month)\
     .filter(extract("year", AlertModel.timestamp) == year)\
     .group_by("day", AlertModel.detection_type)\
     .order_by("day").all()

    day_data = defaultdict(lambda: {"feu": 0, "arme": 0, "criminel": 0})

    for day, detection_type, count in results:
        if detection_type in ["feu", "arme", "criminel"]:
            day_data[int(day)][detection_type] += count

    formatted_data = []
    for day in range(1, num_days + 1):
        formatted_data.append({
            "name": f"{day:02d}",
            "feu": day_data[day]["feu"],
            "arme": day_data[day]["arme"],
            "criminel": day_data[day]["criminel"]
        })

    return formatted_data



#Partie MAryem (2eme page )
def get_ALLalerts(
    db: Session,
    search: Optional[str] = None,
    type: Optional[str] = None,
    statut: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    skip: int = 0,
    limit: int = 10,
):
    query = db.query(AlertModel)

    if search:
        query = query.filter(AlertModel.alert_id.ilike(f"%{search}%"))

    if type and type != "all":
        query = query.filter(AlertModel.detection_type == type)

    if statut and statut != "all":
        query = query.filter(AlertModel.statut.ilike(statut))

    if date_from:
        query = query.filter(AlertModel.timestamp >= datetime.combine(date_from, datetime.min.time()))

    if date_to:
        query = query.filter(AlertModel.timestamp <= datetime.combine(date_to, datetime.max.time()))

    total = query.count()
    results = query.order_by(AlertModel.timestamp.desc()).offset(skip).limit(limit).all()

    alerts_list = []
    for alert in results:
        media_path = alert.media_reference
        filename = os.path.basename(media_path) if media_path else None

        # Construire l'URL publique à partir du point de montage external-media
        media_url = f"{EXTERNAL_MEDIA_URL}/{filename}" if filename else None

        print("==== DEBUG INFO ====")
        print("media_path:", media_path)
        print("filename:", filename)
        print("Does file exist?:", os.path.exists(os.path.join(EXTERNAL_MEDIA_DIR, filename)) if filename else "No file")


        alerts_list.append({
            "alert_id": alert.alert_id,
            "timestamp": alert.timestamp.isoformat(),
            "detection_type": alert.detection_type,
            "statut": alert.statut,
            "media_reference": media_url,
        })

    return alerts_list, total