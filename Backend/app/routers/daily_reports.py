from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, auth
from ..database import get_db
from fastapi import HTTPException, status

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

@router.get("/{report_id}", response_model=schemas.DailyReport)
def read_report(
    report_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    ログインしているユーザーが指定した日報を1件取得するためのAPIエンドポイント
    """
    db_report = crud.get_daily_report(db, report_id=report_id, owner_id=current_user.id)
    if db_report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="日報が見つかりません")
    return db_report

@router.put("/{report_id}", response_model=schemas.DailyReport)
def update_report(
    report_id: int,
    report_update: schemas.DailyReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    """
    ログインユーザーが指定した日報を編集（更新）するエンドポイント
    """
    db_report = crud.edit_daily_report(
        db=db, report_id=report_id, report_update=report_update, owner_id=current_user.id
    )

    if db_report is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="日報が見つかりません")

    return db_report


