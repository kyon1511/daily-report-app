from sqlalchemy.orm import Session
from . import models, schemas

# --- User CRUD ---
# note :User情報を取得するCRUD実装（担当：ログイン画面担当者）
def get_user(db: Session, user_id: str):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.User(id=user.id, email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- DailyReportのCRUD処理 ---
# note :日報一覧情報(降順)を取得するCRUD（担当：日報一覧担当者）
def get_daily_reports(db: Session, owner_id: str, skip: int = 0, limit: int = 10):
    return db.query(models.DailyReport).filter(
        models.DailyReport.owner_id == owner_id
        ).order_by(
            models.DailyReport.report_date.desc()
        ).offset(skip).limit(limit).all()

# note :特定の一つの日報を取得するCRUD
def get_daily_report(db: Session, report_id: int, owner_id: str):
    return db.query(models.DailyReport).filter(
        models.DailyReport.id == report_id,
        models.DailyReport.owner_id == owner_id
    ).first()

# note :特定のユーザーの日報を作成するCRUD（担当：日報新規作成担当者）
def create_daily_report(db: Session, report: schemas.DailyReportCreate, owner_id: str):
    db_report = models.DailyReport(**report.model_dump(), owner_id=owner_id)
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

# note :特定のユーザーの日報を取編集するCRUD（担当：日報編集担当者） 
def edit_daily_report(db: Session, report_id: int, report_update: schemas.DailyReportCreate, owner_id: str):
    db_report = db.query(models.DailyReport).filter(
        models.DailyReport.id == report_id,
        models.DailyReport.owner_id == owner_id
    ).first()

    if db_report is None:
        return None
    
    update_data = report_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_report, key, value)

    db.commit()
    db.refresh(db_report)
    return db_report    

# note :管理画面でユーザーIDを元にユーザーの名前を更新するCRUD
def update_user_name(db: Session, user_id: str, name: str):
    db_user = db.query(models.User).filter(models.User.id == user_id).first()
    if db_user is None:
        return None 
    db_user.name = name
    db.commit()
    db.refresh(db_user)
    return db_user    

# note :編集画面でレポート削除するCRUD
def delete_daily_report(db: Session, report_id: int, owner_id: str):
    db_report = db.query(models.DailyReport).filter(
        models.DailyReport.id == report_id,
        models.DailyReport.owner_id == owner_id
    ).first()

    if db_report is None:
        return None

    db.delete(db_report)
    db.commit()
    return db_report
