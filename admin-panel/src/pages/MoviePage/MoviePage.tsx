import React, { useEffect, useState } from "react";
import styles from "./MoviePage.module.css";
import MovieTable from "../../components/MovieTable/MovieTable";
import { Movie } from "../../domain/Movie";
import Footer from "src/components/Footer/Footer";
import Header from "src/components/Header/Header";
import { useQuery } from "@tanstack/react-query";
import UserStorage from "src/utils/storage/UserStorage";
import { AdminRequestHelperFactory } from "src/utils/api/AdminRequestHelper";
import { useNavigate } from "react-router-dom";
import CreateMovieForm from "src/components/CreateMovieForm/CreateMovieForm";

const MoviePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState(movies);
  const JWT_TOKEN = UserStorage.JWT_TOKEN; // Get the JWT token from storage
  const adminRequestHelper = AdminRequestHelperFactory(JWT_TOKEN); // Create the request helper
  const navigate = useNavigate();

  // Use useQuery to fetch movies
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-movies"],
    queryFn: async (): Promise<Movie[]> => {
      const movies = await adminRequestHelper.getMovies();
      return movies;
    }
  });

  useEffect(() => {
    if (data) {
      setMovies(data as Movie[]);
      setFilteredMovies(data as Movie[]);
    }
  }, [data]);

  const searchMovieCallback = (query: string) => {
    const filteredMovies = movies.filter((movie) =>
      movie.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMovies(filteredMovies);
  };

  const onUpdateMovie = (updatedMovie: Movie) => {
    adminRequestHelper.updateMovie(updatedMovie)
      .then(() => {
        const updatedMovies = movies.map((movie) =>
          movie.id === updatedMovie.id ? updatedMovie : movie
        );
        setMovies(updatedMovies);
        setFilteredMovies(updatedMovies);
      })
  };

  const createMovie = (newMovie: Movie) => {
    adminRequestHelper.createMovie(newMovie)
      .then(() => {
        setMovies((prevMovies) => [...prevMovies, newMovie]);
        setFilteredMovies((prevMovies) => [...prevMovies, newMovie]);
      })
      .catch((error) => alert("Error creating movie: " + error));
  };
  const deleteMovie = (movie: Movie) => {
    adminRequestHelper.deleteMovie(movie.id)
      .then(() => {
        setMovies(movies.filter((_movie => _movie.id != movie.id)));
        setFilteredMovies(movies.filter((_movie => _movie.id != movie.id)));
      })
      .catch((error) => alert("Error creating movie: " + error));
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    UserStorage.clear(); // Clear storage if fetching fails
    navigate("/login"); // Redirect to login page
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.searchBlock}>
          <input
            type="text"
            placeholder="Search by movie title..."
            onChange={(e) => searchMovieCallback(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <MovieTable movies={filteredMovies} onUpdateMovie={onUpdateMovie} deleteMovie={deleteMovie} />

        <div className={styles.createMovieBlock}>
          <CreateMovieForm createMovie={createMovie} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MoviePage;
