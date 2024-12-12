import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import styles from './HomePage.module.css';
import { Movie } from 'src/domain/Movie'; // Import the Movie type
import FilterComponent from '../../components/FilterComponent/FilterComponent';
import MovieList from '../../components/MovieList/MovieList';
import { useQuery } from '@tanstack/react-query';
import UserStorage from 'src/utils/storage/UserStorage';
import { MoviesRequestHelperFactory } from 'src/utils/api/MoviesRequestHelper';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const JWT_TOKEN = UserStorage.JWT_TOKEN;
  const requestHelper = MoviesRequestHelperFactory(JWT_TOKEN);
  const navigate = useNavigate()

  const { data, error, isLoading } = useQuery({
    queryKey: ['get-filter-movies'],
    queryFn: async () => await requestHelper.getMainPageMovies(20)
  });

  useEffect(() => {
    if (data) {
      setMovies(data as Movie[]);
    }
  }, [data]);

  if (!JWT_TOKEN) {
    UserStorage.clear();
    navigate('/login');
  }

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
    <div className={styles.container}>
      <Header />
      <main className={styles.main}>
        <h1>Welcome to MovieApp</h1>
        <p>Discover and manage your favorite movies!</p>
        <FilterComponent onFilteredMovies={setMovies} />
        <MovieList movies={movies} shouldAddFavoriteBtn={true} />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
