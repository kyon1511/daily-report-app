import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware

from app.routers import daily_reports
from app import models, schemas, auth
from app.database import engine

app = FastAPI()

load_dotenv()

app = FastAPI()

# CORS設定
origins = [
    os.getenv("FRONTEND_URL", "http://localhost:3001"),
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(daily_reports.router)

# TO DO:32−34行目はサンプルコード。フロントエンドからログイン済みのIDトークンを付けてこのAPIを呼び出したときに、
# 自分のユーザー情報が正しく返ってくれば、「Firebaseとの認証連携がうまくいっている」確認できる。確認できたら削除する。
@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/")
def read_root():
    return {"Hello": "World"}