from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, List

# --- DailyReport Schemas ---
class DailyReportBase(BaseModel):
    report_date: date
    learned_today: str
    learning_improvement: str
    challenge_for_tomorrow: str
    impressions: str
    other_notes: Optional[str] = None

class DailyReportCreate(DailyReportBase):
    pass

class DailyReport(DailyReportBase):
    id: int
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# --- User Schemas ---
class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    id: str # Firebase UID

class User(UserBase):
    id: str
    created_at: datetime
    daily_reports: List[DailyReport] = []
    class Config: from_attributes = True