import json

from bson import ObjectId 

from .database import db, redisClient
from pymongo import UpdateOne

# Function to add a movie to a user's liked movies list
def add_user_liked_movie(userId: str, movieId: str):
    """
    Adds a movie ID to the user's liked movies list in the 'user_movie_like' collection.
    
    Arguments:
    userId -- The ID of the user
    movieId -- The ID of the movie to be liked by the user
    
    Returns:
    True if the movie was added, False otherwise.
    """
    # Use MongoDB's atomic operations to add a movie to the user's liked list
    result = db.user_movie_like.update_one(
        {"userId": userId},
        {"$addToSet": {"likedMovies": movieId}},  # This ensures no duplicates
        upsert=True  # If the document doesn't exist, it will be created
    )
    
    # Optionally, clear the cache related to this user to ensure the freshest data
    redisClient.delete(f"user_likes_{userId}")  # Clear user-specific cache if exists
    
    # Return True if the update was successful
    return result.modified_count > 0

# Function to get the movies liked by a specific user
def get_user_liked_movies(userId: str):
    """
    Fetches the list of movie IDs liked by the user, and then retrieves the movie details 
    from the 'movies' collection using those IDs.
    
    Arguments:
    userId -- The ID of the user whose liked movies are to be fetched
    
    Returns:
    A list of movie documents liked by the user.
    """
    # Check if the liked movies are cached in Redis
    # cached_likes = redisClient.get(f"user_likes_{userId}")
    # if cached_likes:
    #     return json.loads(cached_likes)  # Return cached data if available
    
    # Fetch the liked movies from the user_movie_like collection
    user_likes = db.user_movie_like.find_one({"userId": userId})
    
    if not user_likes:
        return []  # If no user likes are found, return an empty list
    
    # Get the movie IDs from the likedMovies field
    liked_movie_ids = user_likes.get("likedMovies", [])
    liked_movie_ids = [ObjectId(id) for id in liked_movie_ids]
    
    # Fetch movie details for each liked movie ID from the movies collection
    movies = db.movie.find({"_id": {"$in": liked_movie_ids}})
    movies = list(movies)
    for i in range(len(movies)):
        movies[i]['id'] = str(movies[i]['_id'])
        del movies[i]['_id']
    
    # Cache the result for future requests (optional)
    redisClient.set(f"user_likes_{userId}", json.dumps(movies))
    
    return movies

# Function to search for movies based on various criteria (budget, year, title, description)
def search_movies(searchQuery: str = None, minBudget: int = None, 
                 maxBudget: int = None, minYear: int = None, 
                 maxYear: int = None):
    """
    Searches for movies in the 'movies' collection based on specified criteria.
    
    Arguments:
    searchQuery -- A string to search for in the movie's title or description
    minBudget -- Minimum budget of the movie (optional)
    maxBudget -- Maximum budget of the movie (optional)
    minYear -- Minimum year of release (optional)
    maxYear -- Maximum year of release (optional)
    
    Returns:
    A list of movie documents matching the search criteria.
    """
    query = {}
    
    # Add full-text search query for title and description
    if searchQuery:
        query["$text"] = {"$search": searchQuery}  # MongoDB's full-text search
    
    # Filter based on budget range
    if minBudget:
        query["budget"] = {"$gte": minBudget}
    
    if maxBudget:
        if "budget" not in query:
            query["budget"] = {}
        query["budget"]["$lte"] = maxBudget
    
    # Filter based on year range
    if minYear:
        query["year"] = {"$gte": minYear}
    
    if maxYear:
        if "year" not in query:
            query["year"] = {}
        query["year"]["$lte"] = maxYear
    
    # Query the movies collection
    movies = db.movie.find(query)
    movies = list(movies)
    for i in range(len(movies)):
        movies[i]['id'] = str(movies[i]['_id'])
        del movies[i]['_id']

    return list(movies)  # Return the list of movies that match the query

# Function to get the first 'n' movies from the 'movies' collection
def get_first_n_movies(n: int):
    """
    Fetches the first 'n' movies from the 'movies' collection.
    
    Arguments:
    n -- The number of movies to retrieve.
    
    Returns:
    A list of movie documents.
    """
    # Validate the input to ensure n is a positive integer
    if not isinstance(n, int) or n <= 0:
        raise ValueError("The parameter 'n' must be a positive integer.")
    
    # Retrieve the first 'n' movies from the 'movies' collection.
    # You can modify this query to sort the movies (e.g., by year or title)
    movies = db.movie.find().limit(n)
    movies = list(movies)
    for i in range(len(movies)):
        movies[i]['id'] = str(movies[i]['_id'])
        del movies[i]['_id']
    
    return list(movies)  # Return the list of the first 'n' movies