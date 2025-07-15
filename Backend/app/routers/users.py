from fastapi import APIRouter, Depends
from .. import schemas, auth
router = APIRouter(prefix="/users", tags=["Users"])
@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: schemas.User = Depends(auth.get_current_user)):
    return current_user