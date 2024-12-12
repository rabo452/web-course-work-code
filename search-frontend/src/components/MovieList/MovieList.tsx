import React from 'react';
import { Movie } from 'src/domain/Movie';
import MovieComponent from '../MovieComponent/MovieComponent';
import styles from './MovieList.module.css';

interface MovieListProps {
  movies: Movie[];
  shouldAddFavoriteBtn: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ movies, shouldAddFavoriteBtn }) => {
  return (
    <div className={styles.movieList}>
      {movies.length === 0 ? <h1> no movies found </h1> : null}
      {movies.map((movie) => (
        <MovieComponent 
          key={movie.id}
          movie={movie}
          shouldAddFavoriteBtn={shouldAddFavoriteBtn}
        />
      ))}
    </div>
  );
};

export default MovieList;
