from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertBase(BaseModel):
    detection_type: Optional[str]
    location: Optional[str]
    timestamp: Optional[datetime]
    media_reference: Optional[str]
    statut: Optional[str]  
    video_url: Optional[str]

class AlertCreate(AlertBase):
    pass

class Alert(AlertBase):
    alert_id: str

    class Config:
        orm_mode = True
