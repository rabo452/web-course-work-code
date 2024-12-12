import os
import jwt

from fastapi import Body, FastAPI, Form, HTTPException, Header
from .config import JWT_KEY
from .crud import add_user_liked_movie, get_first_n_movies, search_movies, get_user_liked_movies 

app = FastAPI()

JWT_ALGORITHM = "HS256"
JWT_SECRET = JWT_KEY

def get_jwt_payload(signKey: str, jwt_token: str):
    """
    Decode the JWT token to retrieve the payload.
    
    Arguments:
    signKey -- The secret key used to decode the token
    jwt_token -- The JWT token string
    
    Returns:
    The decoded JWT payload
    """
    return jwt.decode(jwt_token, signKey, algorithms=[JWT_ALGORITHM])

@app.get('/filter')
def filter_controller(searchText: str = " ", priceStart: int = None, priceEnd: int = None, yearStart: int = None, yearEnd: int = None, authorization: str = Header(None)):
    """
    Filters movies based on the search text, price range, and year range.
    
    Arguments:
    searchText -- The text to search for in the movie title or description
    priceStart -- The minimum budget for filtering
    priceEnd -- The maximum budget for filtering
    yearStart -- The starting year for filtering
    yearEnd -- The ending year for filtering
    authorization -- JWT token for user authentication
    
    Returns:
    A list of filtered movies based on the given criteria.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

    # Extract the token from the Authorization header
    token = authorization.split("Bearer ")[1]

    # Decode the token
    try:
        payload = get_jwt_payload(JWT_SECRET, token)
    except:
        raise HTTPException(status_code=401, detail="Authorization header invalid")
    
    # Call the search function to filter the movies
    filtered_movies = search_movies(
        searchQuery=searchText,
        minBudget=priceStart,
        maxBudget=priceEnd,
        minYear=yearStart,
        maxYear=yearEnd
    )

    return filtered_movies

@app.get('/liked-movies')
def liked_movies_controller(authorization: str = Header(None)):
    """
    Fetches the movies liked by a user based on the JWT token in the authorization header.
    
    Arguments:
    authorization -- JWT token for user authentication
    
    Returns:
    A list of movies liked by the user.
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Authorization header missing or invalid")

    # Extract the token from the Authorization header
    token = authorization.split("Bearer ")[1]

    # Decode the token
    try:
        payload = get_jwt_payload(JWT_SECRET, token)
        userId = payload['sub']
    except:
        raise HTTPException(status_code=401, detail="Authorization header invalid")

    # Fetch the liked movies for the user    
    return get_user_liked_movies(userId)

@app.post('/add-liked-movie')
def add_liked_movie_controller(authorization: str = Header(None), movieId: str = Form(None, max_length=40)):
    """
    Adds a movie to the list of liked movies for a user.
    
    Arguments:
    authorization -- JWT token for user authentication
    movieId -- The movie ID to be added to the liked list
    
    Returns:
    A success message or an error message.
    """    
    # Check if authorization or movieId is missing or invalid
    if not authorization or not authorization.startswith("Bearer ") or not movieId:
        raise HTTPException(status_code=400, detail="Authorization header missing or invalid or movieId is required")

    # Extract the token from the Authorization header
    token = authorization.split("Bearer ")[1]

    # Decode the token to get the user ID (this depends on your JWT decoding logic)
    try:
        payload = get_jwt_payload(JWT_SECRET, token)
        userId = payload['sub']
    except Exception as e:
        raise HTTPException(status_code=401, detail="Authorization header invalid")

    # Add the movie to the liked movies list
    result = add_user_liked_movie(userId, movieId)
    
    if result:
        return {"message": "Movie added to liked list successfully."}
    else:
        raise HTTPException(status_code=500, detail="Failed to add movie to liked list.")

@app.get('/main-page-movies')
def main_page_movies_controller(n: int = 10):
    return get_first_n_movies(n)