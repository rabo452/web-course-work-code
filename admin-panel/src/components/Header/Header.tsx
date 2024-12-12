import React from "react";
import styles from "./Header.module.css";
import { Link, useNavigate } from "react-router-dom";
import UserStorage from "src/utils/storage/UserStorage";

function Header() {
  const navigate = useNavigate();
  const username = UserStorage.USERNAME;

  const onSignOut = () => {
    UserStorage.clear();
    navigate("/login"); // Redirect to login page
  };

  return (
    <div>
      <header className={styles.header}>
        <div className={styles.logo}>
          <h1>Admin Panel</h1>
        </div>
        <div className={styles.userSection}>
          <h2>Welcome, {username}!</h2>
          <button className={styles.signOutButton} onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </header>
      <div className={styles['sub-header']}>
        <h1>
          <Link to="/" className={styles.link}>Users Management</Link>
        </h1>
        <h1>
          <Link to="/movies" className={styles.link}>Movies Management</Link>
        </h1>
      </div>
    </div>
  );
}

export default Header;
