import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams } from "react-router";
import "./details.css";

const User = ({ user }) => (
  <div className="user-detail">
    <div className="user-detail">
      <p>
        Name: <span>{user.name}</span>
      </p>
      <p>
        Surname: <span>{user.surname}</span>
      </p>
      <p>
        Email: <span>{user.email}</span>
      </p>
      <p>
        City: <span>{user.city}</span>
      </p>
      <p>
        Birth: <span>{user.DOB}</span>
      </p>
    </div>
    <div>
      <Link className="btn-edit" to={`/edit/${user._id}`}>
        <button>Edit User</button>
      </Link>
    </div>
  </div>
);

export default function UserList() {
  const [user, setUser] = useState([]);
  const [insurance, setInsurance] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  // This method fetches the users from the database.
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(
        `http://localhost:5000/user/${params.id.toString()}`
      );

      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const user = await response.json();
      setUser([user]);
      console.log(insurance);
    }
    getUsers();
    return;
  }, [user.length, params.id, insurance]);

  // This method fetches the users from the database with inscurance.
  async function getIns() {
    const res = await fetch(
      `http://localhost:5000/user/${params.id.toString()}/insc`,
      {
        method: "GET",
      }
    );

    if (!res.ok) {
      const message = `An error occurred: ${res.statusText}`;
      window.alert(message);
      return;
    }
    const insurance = await res.json();
    setInsurance(insurance);
    console.log(insurance)
  }

  async function deleteRecord(id) {
    await fetch(`http://localhost:5000/${params.id.toString()}`, {
      method: "DELETE",
    });

    const newUsers = user.filter((el) => el._id !== id);
    setUser(newUsers);
    navigate("/");
  }

  console.log(user);

  // This method will map out the users on the table
  function userList() {
    return user.map((user) => {
      return <User user={user} key={user._id} />;
    });
  }

  // This following section will display the table with the data of individuals.
  return (
    <div className="details-content">
      <h3 className="details-title">User Details</h3>
      <div>{userList()}</div>
      <p className="details-p">
        User insurance : <span>{insurance}</span>
      </p>
      <br />
      <Link className="btn-link" to={`/user/${params.id.toString()}/insc`}>
        <button onClick={getIns}>Calculate inscurance</button>
      </Link>
      <button className="btn-delete" onClick={deleteRecord}>
        Remove User
      </button>
      <br></br>
      <Link className="btn-link" to={`/`}>
        <button>Back</button>
      </Link>
    </div>
  );
}
