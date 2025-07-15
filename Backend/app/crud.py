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
# TO DO:中身を実装してください（担当：日報一覧担当者）
def get_daily_reports(db: Session, owner_id: str, skip: int = 0, limit: int = 100):
    # TO DO: ここに日報一覧を取得するロジックを実装してください
    return [] # とりあえず空のリストを返すようにしています

def create_daily_report(db: Session, report: schemas.DailyReportCreate, owner_id: str):
    # TO DO: ここに日報を作成するロジックを実装してください（担当：日報新規作成・編集担当者）
    pass