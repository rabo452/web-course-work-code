import src.admin.crud as crud
from src.domain.user import User

def update_user(user_id: str, email: str = None, username: str = None, role: str = None):
    if email is None and username is None and role is None:
        raise Exception(f"Neither email nor username provided for user update")
    crud.update_user(user_id, email, username, role)

def get_users() -> list:
    return crud.get_users()

def does_user_exist(user_id: str) -> bool:
    return crud.does_user_exist(user_id) 

def delete_user(user_id: str):
    crud.delete_user(user_id)

def get_user(user_id: str) -> User:
    return crud.get_user_by_id(user_id)