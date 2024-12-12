import React, { useState } from "react";
import styles from "./LoginPage.module.css";
import { useNavigate } from "react-router-dom";
import { AuthRequestHelper } from "src/utils/api/AuthRequestHelper";
import UserStorage from "src/utils/storage/UserStorage";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const authRequestHelper = new AuthRequestHelper();

  // if the user has been already logged in, then move them into the admin panel 
  if (UserStorage.JWT_TOKEN != "") {
    navigate('/')
  }

  const onSubmit = () => {
    // try to authorize, if the credentials are correct, then it'd return the JWT token
    authRequestHelper.getUserJWT(username, password)
        .then((JWT_TOKEN) => {
            // in the case of successful authorization, proceed to the admin panel
            UserStorage.JWT_TOKEN = JWT_TOKEN;
            UserStorage.USERNAME = username;
            navigate('/')
        })
        .catch((err) => alert("Invalid credentials, please, try again."))
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.greeting}>Welcome to the Admin Panel</h1>
      <div className={styles.form}>
        <label htmlFor="username" className={styles.label}>Username</label>
        <input
          type="text"
          id="username"
          className={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
        />
        <label htmlFor="password" className={styles.label}>Password</label>
        <input
          type="password"
          id="password"
          className={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
        />
        <input type="button" onClick={(e) => onSubmit()} className={styles.loginButton} value="Login" />
      </div>
    </div>
  );
}

export default LoginPage;
