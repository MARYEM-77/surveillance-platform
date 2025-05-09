from sqlalchemy import Column, String, Text, TIMESTAMP
from app.db.session import Base

class Alert(Base):
    __tablename__ = "alerts"

    alert_id = Column(Text, primary_key=True, index=True)
    detection_type = Column(String(50))
    location = Column(String(255))
    timestamp = Column(TIMESTAMP)
    media_reference = Column(Text)
    statut = Column(String, default="Non traité")  # Nouvelle colonne


