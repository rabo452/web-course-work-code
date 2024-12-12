import React, { useState } from "react";
import styles from "./UserTable.module.css";
import { User } from "../../domain/User";

type UserTableProps = {
  users: User[];
  updateUserCallback: (id: string, username: string, email: string, role: string) => void;
  removeUserCallback: (user: User) => void;
};

const UserTable: React.FC<UserTableProps> = ({ users, updateUserCallback, removeUserCallback }) => {
  const [editing, setEditing] = useState<{ [key: string]: keyof User | null }>({});

  const handleSave = (userId: string, field: keyof User, newValue: string) => {
    const updatedUser = users.find((u) => u.id === userId);
    if (updatedUser) {
      // Update the user with the new field value
      updateUserCallback(userId, 
        field === "username" ? newValue : updatedUser.username, 
        field === "email" ? newValue : updatedUser.email, 
        field === "role" ? newValue : updatedUser.role
      );
      setEditing((prev) => ({ ...prev, [userId]: null })); // Stop editing after save
    }
  };

  const renderEditableCell = (
    user: User,
    field: keyof User,
    type: "text" | "email" = "text"
  ) => {
    return editing[user.id] === field ? (
      <input
        type={type}
        defaultValue={user[field]}
        onBlur={(e) => handleSave(user.id, field, e.target.value)}
        autoFocus
      />
    ) : (
      <span>{user[field]}</span>
    );
  };

  const handleEditClick = (userId: string, field: keyof User) => {
    setEditing((prev) => ({ ...prev, [userId]: field })); // Start editing the clicked field
  };

  const deleteUser = (user: User) => {
    removeUserCallback(user); // Call the removeUserCallback to remove the user
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>

              {/* Editable Username Field */}
              <td>
                {renderEditableCell(user, "username")}
                {editing[user.id] !== "username" && (
                  <button
                    onClick={() => handleEditClick(user.id, "username")}
                    className={styles.changeButton}
                  >
                    Change
                  </button>
                )}
              </td>

              {/* Editable Email Field */}
              <td>
                {renderEditableCell(user, "email", "email")}
                {editing[user.id] !== "email" && (
                  <button
                    onClick={() => handleEditClick(user.id, "email")}
                    className={styles.changeButton}
                  >
                    Change
                  </button>
                )}
              </td>

              {/* Editable Role Field */}
              <td>
                {renderEditableCell(user, "role")}
                {editing[user.id] !== "role" && user.role !== "admin" && (
                  <button
                    onClick={() => handleEditClick(user.id, "role")}
                    className={styles.changeButton}
                  >
                    Change
                  </button>
                )}
              </td>

              {/* Actions - Delete */}
              <td>
                {user.role !== "admin" && (
                  <button onClick={() => deleteUser(user)} className={styles.deleteButton}>
                    Delete
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

export default UserTable;
