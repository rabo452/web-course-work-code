import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import UserStorage from '../../utils/storage/UserStorage';

const Header: React.FC = () => {
  const JWT = UserStorage.JWT_TOKEN;
  const navigate = useNavigate();

  const logoutCallback = () => {
    UserStorage.clear();
    navigate(0);
  }

  return (
    <header className={styles.header}>
      <div className={styles.logo}><Link to="/" className={styles.navLink}>🎬 MovieApp</Link></div>
      <nav className={styles.nav}>
        <Link to="/liked-movies" className={styles.navLink}>Liked Movies</Link>
        {!JWT ? (
          <>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/signup" className={styles.navLink}>Sign Up</Link>
          </>
        ) : (
          <div className={styles.logout} onClick={logoutCallback}>Log out</div>
        )}
      </nav>
    </header>
  );
};

export default Header;
