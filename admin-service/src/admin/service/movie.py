import src.admin.crud as crud
from src.domain.movie import Movie

def get_movies() -> list:
    """Retrieve a list of movies."""
    return crud.get_movies()

def add_new_movie(title: str, thumbnail: str, budget: float, mainCharacters: list, description: str, year: int) -> str:
    """Add a new movie to the database."""
    # Call the CRUD method to insert a movie and return the inserted movie's ID
    return crud.add_movie(title, thumbnail, budget, mainCharacters, description, year)

def update_movie(movie_id: str, thumbnail: str = None, budget: float = None, mainCharacters: list = None, 
                 description: str = None, year: int = None, title: str = None) -> None:
    """Update an existing movie."""
    # Call the CRUD method to update the movie
    crud.update_movie(movie_id, thumbnail, budget, mainCharacters, description, year, title)

def delete_movie(movie_id: str) -> None:
    """Delete a movie by its ID."""
    # Call the CRUD method to delete the movie
    crud.delete_movie(movie_id)

def get_movie_by_id(movie_id: str) -> Movie:
    """Get a movie by its ID."""
    movie = crud.get_movie_by_id(movie_id)
    if movie:
        return movie
    else:
        raise ValueError(f"Movie with ID {movie_id} not found.")
