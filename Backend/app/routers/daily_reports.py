from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, auth
from ..database import get_db

router = APIRouter(
    prefix="/daily-reports",
    tags=["Daily Reports"],
)

@router.post("/", response_model=schemas.DailyReport)
def create_report(
    report: schemas.DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    新しい日報を作成するためのAPIエンドポイント
    """
    return crud.create_daily_report(db=db, report=report, owner_id=current_user.id)

@router.get("/", response_model=List[schemas.DailyReport])
def read_reports(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    ログインしているユーザーの日報を一覧で取得するためのAPIエンドポイント
    """
    return crud.get_daily_reports(db, owner_id=current_user.id)