import React, { useState } from "react";
import styles from "./MovieTable.module.css";
import { Movie } from "../../domain/Movie";

type MovieTableProps = {
  movies: Movie[];
  onUpdateMovie: (updatedMovie: Movie) => void;
  deleteMovie: (movie: Movie) => void
};

const MovieTable: React.FC<MovieTableProps> = ({ movies, onUpdateMovie, deleteMovie }: MovieTableProps) => {
  const [editMovie, setEditMovie] = useState<Movie | null>(null);
  const [editField, setEditField] = useState<string>("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");

  // Save edited value
  const handleSave = (id: string, field: keyof Movie, newValue: string) => {
    const updatedMovie = movies.find((movie) => movie.id === id);
    if (updatedMovie) {
      // Convert the newValue to the appropriate type based on the field.
      switch (field) {
        case "year":
          updatedMovie[field] = parseInt(newValue); // Ensure `year` is a number
          break;
        case "budget":
          updatedMovie[field] = parseFloat(newValue); // Ensure `budget` is a number
          break;
        case "mainCharacters":
          updatedMovie[field] = newValue.split(",").map((char) => char.trim()); // Convert comma-separated list to array
          break;
        case "thumbnail":
        case "title":
        case "description":
          updatedMovie[field] = newValue; // Keep string values as they are
          break;
        default:
          break;
      }
  
      onUpdateMovie(updatedMovie); // Pass the updated movie to the parent
      setEditMovie(null);
      setEditField("");
    }
  };
  

  // Edit a field
  const handleEdit = (movie: Movie, field: keyof Movie) => {
    setEditMovie(movie);
    setEditField(field);
    if (field === "thumbnail") {
      setNewImageUrl(movie.thumbnail); // Pre-fill the image URL for editing
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditMovie(null);
    setEditField("");
    setNewImageUrl(""); // Reset image URL when canceling
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Description</th>
            <th>Year of Production</th>
            <th>Main Characters</th>
            <th>Budget</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie.id}>
              <td>{movie.id}</td>
              <td>
                {editMovie?.id === movie.id && editField === "thumbnail" ? (
                  <div>
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                    />
                    <button
                      onClick={() => {
                        handleSave(movie.id, "thumbnail", newImageUrl); // Correct field name
                      }}
                      className={styles.changeButton}
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <img src={movie.thumbnail} alt={movie.title} />
                    <button
                      onClick={() => handleEdit(movie, "thumbnail")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                {editMovie?.id === movie.id && editField === "title" ? (
                  <input
                    type="text"
                    defaultValue={movie.title}
                    onBlur={(e) => handleSave(movie.id, "title", e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    {movie.title}
                    <button
                      onClick={() => handleEdit(movie, "title")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                {editMovie?.id === movie.id && editField === "description" ? (
                  <input
                    type="text"
                    defaultValue={movie.description}
                    onBlur={(e) => handleSave(movie.id, "description", e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    {movie.description}
                    <button
                      onClick={() => handleEdit(movie, "description")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                {editMovie?.id === movie.id && editField === "year" ? (
                  <input
                    type="number"
                    defaultValue={movie.year}
                    onBlur={(e) => handleSave(movie.id, "year", e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    {movie.year}
                    <button
                      onClick={() => handleEdit(movie, "year")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                {editMovie?.id === movie.id && editField === "mainCharacters" ? (
                  <input
                    type="text"
                    defaultValue={movie.mainCharacters.join(", ")}
                    onBlur={(e) =>
                      handleSave(movie.id, "mainCharacters", e.target.value)
                    }
                    autoFocus
                  />
                ) : (
                  <>
                    {movie.mainCharacters.join(", ")}
                    <button
                      onClick={() => handleEdit(movie, "mainCharacters")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                {editMovie?.id === movie.id && editField === "budget" ? (
                  <input
                    type="number"
                    defaultValue={movie.budget}
                    onBlur={(e) => handleSave(movie.id, "budget", e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    ${movie.budget.toLocaleString()}
                    <button
                      onClick={() => handleEdit(movie, "budget")}
                      className={styles.changeButton}
                    >
                      Change
                    </button>
                  </>
                )}
              </td>
              <td>
                <button
                  onClick={() => deleteMovie(movie)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
                {editMovie?.id === movie.id && (
                  <button onClick={handleCancel} className={styles.cancelButton}>
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MovieTable;
