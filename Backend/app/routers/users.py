from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from .. import crud, schemas, auth, models
from ..database import get_db

router = APIRouter(prefix="/users", tags=["Users"])

# ユーザー名のデータ形式を定義
class UserNameUpdate(BaseModel):
    name: str

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@router.put("/me", response_model=schemas.User)
def update_user_name_endpoint(
    user_update: UserNameUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    """
    ログインユーザーの名前を更新します。
    """
    updated_user = crud.update_user_name(db, user_id=current_user.id, name=user_update.name)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user