import React, { useState } from 'react';
import styles from './LoginPage.module.css';
import UserStorage from 'src/utils/storage/UserStorage';
import { useNavigate } from 'react-router-dom';
import { AuthRequestHelper } from 'src/utils/api/AuthRequestHelper';
import Header from 'src/components/Header/Header';
import Footer from 'src/components/Footer/Footer';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const JWT = UserStorage.JWT_TOKEN;

  // If the user is already logged in, redirect to the homepage
  if (JWT) {
    navigate('/');
  }

  const handleLogin = () => {
    (new AuthRequestHelper()).getUserJWT(username, password)
      .then((userJWT) => {
        // Store the JWT token after a successful login
        UserStorage.JWT_TOKEN = userJWT;
        // Redirect to the main page
        navigate('/');
      })
      .catch(() => alert('Login failed. Please check your credentials.'));
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Login</h1>
        <form className={styles.form}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />
          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
