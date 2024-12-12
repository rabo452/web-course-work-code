import React, { useState, useEffect } from "react";
import UserTable from "../../components/UserTable/UserTable";
import styles from "./UserPage.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import { User } from "@domain/User";
import { useQuery } from "@tanstack/react-query";
import UserStorage from "src/utils/storage/UserStorage";
import { AdminRequestHelperFactory } from "src/utils/api/AdminRequestHelper";
import { useNavigate } from "react-router-dom";
import AddUserForm from "src/components/AddUserForm/AddUserForm";
import { AuthRequestHelper } from "src/utils/api/AuthRequestHelper";

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State for users
  const JWT_TOKEN = UserStorage.JWT_TOKEN; // Get the JWT token from storage
  const adminRequestHelper = AdminRequestHelperFactory(JWT_TOKEN); // Create the request helper
  const navigate = useNavigate();

  // Use useQuery to fetch users
  const { isLoading, isError, data } = useQuery({
    queryKey: ["get-admin-users"],
    queryFn: async (): Promise<User[]> => {
      const users = await adminRequestHelper.getUsers();
      return users;
    }
  });
  const addUserCallback = (username: string, password: string, email: string) => {
    const authApiHelper = new AuthRequestHelper();
    authApiHelper.createUser(username, password, email)
      .then((id) => setUsers([...users, {username, email, id, role: 'viewer'}]))
      .catch(() => alert("unable to create a user"))
  }
  const updateUserCallback = (id: string, username: string, email: string, role: string) => {
    const user = {id, username, email, role}
    console.log(user);
    adminRequestHelper.updateUser(id, username, email, role)
    .then(() => setUsers([...users.filter((_user) => _user.id != id), user]));
  }
  const removeUserCallback = (user: User) => {
    adminRequestHelper.deleteUser(user.id)
      .then(() => setUsers(users.filter((_user) => _user.id != user.id)));
  }

  // once data is loaded, render the users
  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    UserStorage.clear(); // Clear storage if fetching fails
    navigate("/login"); // Redirect to login page
    return <div>Error occurred</div>;
  }

  return (
    <div>
      <Header />
      <div className={styles.pageContainer}>
        <UserTable users={users} updateUserCallback={updateUserCallback} removeUserCallback={removeUserCallback}  />
        <center><h1>Add a new user:</h1></center>
        <AddUserForm addUserCallback={addUserCallback} />
      </div>
      <Footer />
    </div>
  );
};

export default UserPage;
