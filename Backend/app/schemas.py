from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# --- DailyReport Schemas ---
class DailyReportBase(BaseModel):
    title: str
    content: str

class DailyReportCreate(DailyReportBase):
    pass

class DailyReport(DailyReportBase):
    id: int
    owner_id: str
    created_at: datetime

    class Config:
        from_attributes = True # v2: orm_mode = True

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