# TO DO:日報CRUDファイルです。
# 日報の作成（POST）と一覧取得（GET）を行うためのAPIエンドポイントを定義しなければなりません。
# 以下はサーバーを起動させるために仮のコードを記述していますので変更してください。

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, auth
from ..database import get_db

# このファイル用のルーターを作成
router = APIRouter(
    prefix="/daily-reports",
    tags=["Daily Reports"],
)

# サーバーを起動させるための仮のエンドポイント
@router.get("/")
def get_reports_placeholder():
    return {"message": "Daily reports endpoint is active"}