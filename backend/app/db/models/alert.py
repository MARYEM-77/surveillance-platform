from sqlalchemy import Column, String, Text, TIMESTAMP
from app.db.session import Base
import shortuuid

class Alert(Base):
    
    __tablename__ = "alerts"

    alert_id = Column(String(22), primary_key=True, index=True, default=shortuuid.uuid)
    detection_type = Column(String(50))
    location = Column(String(255))
    timestamp = Column(TIMESTAMP)
    media_reference = Column(Text)
    statut = Column(String, default="Non traité")  
    video_url = Column(Text)


