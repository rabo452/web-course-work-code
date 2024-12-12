import React, { useState } from 'react';
import { Movie } from 'src/domain/Movie';
import styles from './MovieComponent.module.css';
import { MoviesRequestHelperFactory } from 'src/utils/api/MoviesRequestHelper';
import UserStorage from 'src/utils/storage/UserStorage';

interface MovieComponentProps {
  movie: Movie;
  shouldAddFavoriteBtn: boolean;
}

const MovieComponent: React.FC<MovieComponentProps> = ({ movie, shouldAddFavoriteBtn }) => {
  const [isFavoriteHidden, setFavoriteHidden] = useState(false);
  const JWT_TOKEN = UserStorage.JWT_TOKEN;
  const requestHelper = MoviesRequestHelperFactory(JWT_TOKEN);

  const onAddToFavorites = () => {
    requestHelper.addFavoriteMovie(movie.id)
      .then(() => setFavoriteHidden(true));
  }

  return (
    <div className={styles.movieCard}>
      <img src={movie.thumbnail} alt={movie.title} className={styles.movieThumbnail} />
      <h3>{movie.title}</h3>
      <p>{movie.description}</p>
      <p><strong>Year:</strong> {movie.year}</p>
      <p><strong>Budget:</strong> ${movie.budget.toLocaleString()}</p>
      <p><strong>Main Characters:</strong> {movie.mainCharacters.join(', ')}</p>
      
      {/* Add to Favorites button */}
      <button 
          className={styles.favoriteButton} 
          onClick={() => onAddToFavorites()}
          style={{display: shouldAddFavoriteBtn && !isFavoriteHidden ? 'initial': 'none'}}
        >
        Add to Favorites
      </button>
    </div>
  );
};

export default MovieComponent;
