import React, { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import MovieList from '../../components/MovieList/MovieList';
import { Movie } from 'src/domain/Movie';
import styles from './LikedMoviesPage.module.css';
import { MoviesRequestHelperFactory } from 'src/utils/api/MoviesRequestHelper';
import UserStorage from 'src/utils/storage/UserStorage';
import { useQuery } from '@tanstack/react-query';

const LikedMoviesPage: React.FC = () => {
  // Retrieving favorite movies from localStorage (or use another state management method)
  const [likedMovies, setLikedMovies] = useState<Movie[]>([]);
  const JWT_TOKEN = UserStorage.JWT_TOKEN;
  const requestHelper = MoviesRequestHelperFactory(JWT_TOKEN);

  const { data, error, isLoading } = useQuery({
    queryKey: ['get-liked-movies'],
    queryFn: async () => await requestHelper.getFavoriteMovies()
  });

  useEffect(() => {
    if (data) {
      setLikedMovies(data);
    }
  }, [data]);

  if (isLoading) {
    return (
      <div>
        <Header />
        <h1>loading...</h1>
        <Footer />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div>
        <Header />
        <h1>Some error happened...</h1>
        <Footer />
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <main className={styles.main}>
          <center><h1>Your Liked Movies</h1></center>
          <MovieList movies={likedMovies} shouldAddFavoriteBtn={false} />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LikedMoviesPage;
