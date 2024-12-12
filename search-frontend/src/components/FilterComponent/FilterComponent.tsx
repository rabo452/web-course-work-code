import React, { useState } from 'react';
import { Movie } from 'src/domain/Movie';
import styles from './FilterComponent.module.css';
import UserStorage from 'src/utils/storage/UserStorage';
import { MoviesRequestHelperFactory } from 'src/utils/api/MoviesRequestHelper';

interface FilterComponentProps {
  onFilteredMovies: (moives: Movie[]) => void;
}

const FilterComponent: React.FC<FilterComponentProps> = ({ onFilteredMovies }) => {
  const [title, setTitle] = useState('');
  const [yearMin, setYearMin] = useState(1900);
  const [yearMax, setYearMax] = useState(2024);
  const [budgetMin, setBudgetMin] = useState(0);
  const [budgetMax, setBudgetMax] = useState(1000000000);
  const JWT_TOKEN = UserStorage.JWT_TOKEN;
  const requestHelper = MoviesRequestHelperFactory(JWT_TOKEN);

  const handleFilter = () => {
    requestHelper.filterMovies(title, budgetMin, budgetMax, yearMin, yearMax)
      .then((movies) => onFilteredMovies(movies))
  };

  return (
    <div className={styles.filterContainer}>
      {/* Title Search Input */}
      <div className={styles.filterInput}>
        <label htmlFor="title">Search Movies</label>
        <input
          className={styles.bigInput}
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter movie title or keyword"
        />
      </div>

      {/* Year Range Filter */}
      <div className={styles.filterInput}>
        <label htmlFor="year">Year Range</label>
        <div className={styles.rangeInput}>
          <input
            type="number"
            id="yearMin"
            value={yearMin}
            onChange={(e) => setYearMin(Number(e.target.value))}
            min="1900"
            max="2024"
            placeholder="Min Year"
          />
          <input
            type="number"
            id="yearMax"
            value={yearMax}
            onChange={(e) => setYearMax(Number(e.target.value))}
            min="1900"
            max="2024"
            placeholder="Max Year"
          />
        </div>
      </div>

      {/* Budget Range Filter */}
      <div className={styles.filterInput}>
        <label htmlFor="budget">Budget Range</label>
        <div className={styles.rangeInput}>
          <input
            type="number"
            id="budgetMin"
            value={budgetMin}
            onChange={(e) => setBudgetMin(Number(e.target.value))}
            min="0"
            max="1000000000"
            placeholder="Min Budget"
          />
          <input
            type="number"
            id="budgetMax"
            value={budgetMax}
            onChange={(e) => setBudgetMax(Number(e.target.value))}
            min="0"
            max="1000000000"
            placeholder="Max Budget"
          />
        </div>
      </div>

      {/* Filter Button */}
      <button onClick={handleFilter}>Filter Movies</button>
    </div>
  );
};

export default FilterComponent;
