import { User } from "@domain/User";
import React, { useState } from "react";
import styles from "./AddUserForm.module.css";

type AddUserFormProps = {
  addUserCallback: (username: string, password: string, email: string) => void;
};

const AddUserForm: React.FC<AddUserFormProps> = ({ addUserCallback }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addUserCallback(formData.username, formData.password, formData.email);

    // Clear the form after submission
    setFormData({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <form className={styles.userForm} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          minLength={8}
          value={formData.username}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          minLength={8}
          value={formData.password}
          onChange={handleInputChange}
          required
        />
      </div>
      <button type="submit" className={styles.submitButton}>
        Add User
      </button>
    </form>
  );
};

export default AddUserForm;
