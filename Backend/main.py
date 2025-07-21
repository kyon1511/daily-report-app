import os
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, daily_reports

from fastapi import HTTPException
from sqlalchemy import text
from app.database import get_db
from fastapi import Depends

# .envファイルを最初に読み込む
load_dotenv()


app = FastAPI()

# CORS設定によりフロントエンドからのアクセスを許可する
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3000") 
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # フロントエンドのURL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 作成したルーターにアクセスできるようにするためのコード
app.include_router(users.router)
app.include_router(daily_reports.router)

# サーバーの起動を確認するためのルートエンドポイント
@app.get("/")
def read_root():
    return {"Hello": "World"}

from sqlalchemy import text  # ← 追加！

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))  # ← text() で囲むのがポイント！
        return {"status": "connected"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}
