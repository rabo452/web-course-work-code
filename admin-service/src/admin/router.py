from typing import List
from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel, EmailStr, Field
from src.admin.service.user import get_users, update_user, does_user_exist, delete_user, get_user
from src.admin.service.movie import get_movies, add_new_movie, update_movie, delete_movie
from src.domain.movie import Movie

router = APIRouter()

# Define input validation for movie creation and update using Pydantic model
class MovieCreateUpdateModel(BaseModel):
    title: str
    thumbnail: str
    budget: float
    mainCharacters: List[str]
    description: str
    year: int

# Define Pydantic model
class MovieModel(BaseModel):
    id: str
    title: str
    thumbnail: str
    budget: float
    mainCharacters: List[str]
    description: str
    year: int

    # FastAPI automatically uses this to convert the model to JSON format
    class Config:
        from_attributes=True


@router.put('/user/update')
def update_user_controller(
    user_id: str = Form(None, max_length=255, min_length=8),
    email: str = Form(None, max_length=255, min_length=8),
    username: str = Form(None, max_length=255, min_length=8),
    role: str = Form(None, max_length=40)
):
    # Check if user exists
    if not does_user_exist(user_id):
        raise HTTPException(status_code=400, detail="User does not exist")

    # Validate that at least one field is provided
    if not any([email, username, role]):
        raise HTTPException(status_code=400, detail="No fields to update")

    # Update the user
    update_user(user_id, email, username, role)
    return {
        "code": 200,
        "message": f"User {user_id} has been updated"
    }


@router.delete('/user/delete/{user_id}')
def delete_user_controller(user_id: str):
    if not does_user_exist(user_id):
        raise HTTPException(status_code=400, detail=f"user {user_id} does not exist")
    
    user = get_user(user_id)

    if user.role == "admin":
        raise HTTPException(status_code=400, detail="Admin accounts cannot be deleted")
    
    delete_user(user_id)
    return {
        "code": 200,
        "message": f"user {user_id} has been deleted"
    }

@router.get('/get-users')
def get_users_controller():
    return get_users()

# Movie Routes

@router.get('/get-movies')
async def get_movies_controller():
    movies = get_movies()
    return [MovieModel.from_orm(movie) for movie in movies]

@router.post('/movie/create-movie')
async def add_new_movie_controller(movie: MovieCreateUpdateModel):
    """Add a new movie."""
    movie_id = add_new_movie(
        movie.title,
        movie.thumbnail,
        movie.budget,
        movie.mainCharacters,
        movie.description,
        movie.year
    )
    return {
        "code": 201,
        "message": f"New movie has been added with ID {movie_id}"
    }

@router.put('/movie/{movie_id}')
async def update_movie_controller(movie_id: str, movie: MovieCreateUpdateModel):
    """Update movie details."""
    update_movie(
        movie_id,
        movie.thumbnail,
        movie.budget,
        movie.mainCharacters,
        movie.description,
        movie.year,
        movie.title
    )
    return {
        "code": 200,
        "message": f"Movie {movie_id} has been updated"
    }

@router.delete('/movie/delete/{movie_id}')
async def delete_movie_controller(movie_id: str):
    """Delete a movie by its ID."""
    delete_movie(movie_id)
    return {
        "code": 200,
        "message": f"Movie {movie_id} has been deleted"
    }
