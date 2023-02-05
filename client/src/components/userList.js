import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./userList.css";

const User = ({ user }) => (
  <tbody>
    <tr className="table-center">
      <th>Name and lastname</th>
      <th>E-mail</th>
      <th>City</th>
      <th>Birth Date</th>
    </tr>
    <tr>
      <td>{user.name} {user.surname}</td>
      <td>{user.email}</td>
      <td>{user.city}</td>
      <td>{user.DOB}</td>
      <td className="td-link">
        <Link className="btn btn-link" to={`/user/${user._id}`}>
          Details
        </Link>{" "}
      </td>
    </tr>
  </tbody>
);

export default function UserList() {
  const [users, setUsers] = useState([]);

  // This method fetches the records from the database.
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(`http://localhost:5000/user/`);

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const users = await response.json();
      setUsers(users);
    }

    getUsers();

    return;
  }, [users.length]);

  console.log(users);

  // This method will map out the records on the table
  function userList() {
    return users.map((user) => {
      return <User user={user} key={user._id} />;
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <div className="list-content">
      <h3 className="list-title">User List</h3>
      <table>
        <table>{userList()}</table>
      </table>
      <Link className="table-button" to={`/create`}>
        <button>Add new user</button>
      </Link>
    </div>
  );
}
