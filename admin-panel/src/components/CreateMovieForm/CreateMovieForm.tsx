import React, { useState } from "react";
import { Movie } from "../../domain/Movie";
import styles from "./CreateMovieForm.module.css";

type CreateMovieFormProps = {
  createMovie: (newMovie: Movie) => void;
};

const CreateMovieForm: React.FC<CreateMovieFormProps> = ({ createMovie }) => {
  const [movieData, setMovieData] = useState({
    id: "", // This will be set automatically
    thumbnail: "",
    title: "",
    description: "",
    year: new Date().getFullYear(),
    mainCharacters: "",
    budget: 0,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMovieData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!movieData.budget || !movieData.description || !movieData.year || !movieData.title) {
        alert("invalid movie information");
        return;
    }

    // Generate a unique id for the new movie
    const newMovie: Movie = { ...movieData, id: Date.now().toString(), mainCharacters: movieData.mainCharacters.split(",") }
    createMovie(newMovie); // Call the passed callback function
    // Clear form after submitting
    // setMovieData({
    //   id: "",
    //   thumbnail: "",
    //   title: "",
    //   description: "",
    //   year: new Date().getFullYear(),
    //   mainCharacters: "",
    //   budget: 0,
    // });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <h2>Create a New Movie</h2>

      <div className={styles.inputGroup}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={movieData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Description</label>
        <textarea
          name="description"
          value={movieData.description}
          onChange={handleInputChange}
          required
          style={{width: "100%", maxWidth: "100%"}}
          rows={4}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Thumbnail</label>
        <input
          type="text"
          name="thumbnail"
          value={movieData.thumbnail}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Year</label>
        <input
          type="number"
          name="year"
          value={movieData.year}
          onChange={handleInputChange}
          min="1900"
          max={new Date().getFullYear()}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Main Characters</label>
        <input
          type="text"
          name="mainCharacters"
          value={movieData.mainCharacters}
          onChange={handleInputChange}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>Budget</label>
        <input
          type="number"
          name="budget"
          value={movieData.budget}
          onChange={handleInputChange}
          min="0"
          required
        />
      </div>

      <button type="submit" className={styles.submitButton}>Create Movie</button>
    </form>
  );
};

export default CreateMovieForm;
