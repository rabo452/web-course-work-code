from bson.objectid import ObjectId
from src.database import db
from src.domain.movie import Movie
from src.domain.user import User

def delete_user(user_id: str):
    """Delete a user by their user_id."""
    user_collection = db["user"]  # Local collection reference
    user_collection.delete_one({"_id": ObjectId(user_id)})  # Ensure user_id is treated as ObjectId

def update_user(user_id: str, email: str = None, username: str = None, role: str = None):
    """Update a user's email and username."""
    user_collection = db["user"]  # Local collection reference

    update_data = {}
    if email is not None:
        update_data["email"] = email
    if username is not None:
        update_data["username"] = username
    if role is not None:
        update_data["role"] = role

    user_collection.update_one(
        {"_id": ObjectId(user_id)},  # Ensure user_id is treated as ObjectId
        {"$set": update_data}
    )

def get_users() -> list:
    """Get a list of users."""
    user_collection = db["user"]  # Local collection reference
    return [
        User(id=str(user["_id"]), email=user["email"], username=user["username"], role=user["role"])
        for user in user_collection.find()
    ]

def does_user_exist(user_id: str) -> bool:
    """Check if a user exists by their user_id."""
    user_collection = db["user"]  # Local collection reference
    user = user_collection.find_one({"_id": ObjectId(user_id)})  # Ensure user_id is treated as ObjectId
    
    return user is not None

def get_user_by_id(user_id: str) -> User:
    """
    Retrieve a user by their user_id.
    """
    user_collection = db["user"]  # Local collection reference
    
    try:
        # Convert user_id to ObjectId
        user = user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            # Map MongoDB document to the User model
            return User(
                id=user_id,
                email=user["email"],
                username=user["username"],
                role=user["role"]
            )
        else:
            return None  # User not found
    except Exception as e:
        raise ValueError(f"Invalid user_id: {user_id}. Error: {str(e)}")

# Movie CRUD Operations

def get_movies() -> list:
    """Get a list of movies."""
    movie_collection = db["movie"]  # Local collection reference
    movies = movie_collection.find()
    return [Movie(**movie) for movie in movies]

def add_movie(title: str, thumbnail: str, budget: float, mainCharacters: list, description: str, year: int) -> str:
    """Create a new movie and return its ID."""
    movie_collection = db["movie"]  # Local collection reference
    movie_data = {
        "title": title,
        "thumbnail": thumbnail,
        "budget": budget,
        "mainCharacters": mainCharacters,
        "description": description,
        "year": year
    }
    
    # Insert movie into collection and get the inserted ID
    result = movie_collection.insert_one(movie_data)
    return str(result.inserted_id)

def update_movie(movie_id: str, thumbnail: str = None, budget: float = None, mainCharacters: list = None,
                 description: str = None, year: int = None, title: str = None) -> None:
    """Update movie details."""
    movie_collection = db["movie"]  # Local collection reference

    update_data = {}
    if title is not None:
        update_data["title"] = title
    if thumbnail is not None:
        update_data["thumbnail"] = thumbnail
    if budget is not None:
        update_data["budget"] = budget
    if mainCharacters is not None:
        update_data["mainCharacters"] = mainCharacters
    if description is not None:
        update_data["description"] = description
    if year is not None:
        update_data["year"] = year
    
    movie_collection.update_one(
        {"_id": ObjectId(movie_id)},  # Ensure movie_id is treated as ObjectId
        {"$set": update_data}
    )

def delete_movie(movie_id: str) -> None:
    """Delete a movie by its movie_id."""
    movie_collection = db["movie"]  # Local collection reference
    movie_collection.delete_one({"_id": ObjectId(movie_id)})  # Ensure movie_id is treated as ObjectId
