import React, { useState } from 'react';
import styles from './SignUpPage.module.css';
import UserStorage from 'src/utils/storage/UserStorage';
import { useNavigate } from 'react-router-dom';
import { AuthRequestHelper } from 'src/utils/api/AuthRequestHelper';
import Header from 'src/components/Header/Header';
import Footer from 'src/components/Footer/Footer';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const JWT = UserStorage.JWT_TOKEN;

  const handleSignUp = () => {
    (new AuthRequestHelper()).signUp(name, password, email)
      .then((userJWT) => {
        UserStorage.JWT_TOKEN = userJWT;
        navigate('/');
      })
      .catch(() => alert('unable to sign up, such user does exist'))
  };

  if (JWT) {
    navigate('/');
  }


  return (
    <div>
      <Header />
      <div className={styles.container}>
        <h1>Sign Up</h1>
        <form className={styles.form}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            required
          />
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
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
          <button type="button" onClick={handleSignUp}>
            Sign Up
          </button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default SignUpPage;
