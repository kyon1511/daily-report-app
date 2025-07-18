import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, daily_reports

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