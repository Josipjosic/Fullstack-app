import React, { useState } from "react";
import { useNavigate } from "react-router";
import './create.css'

export default function Create() {
  const [form, setForm] = useState({
    email: "",
    name: "",
    surname: "",
    city: "".toLowerCase(),
    DOB: "",
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new user to the database.
    const newUser = { ...form };

    await fetch("http://localhost:5000/user/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).catch((error) => {
      window.alert(error);
      return;
    });

    setForm({ email: "", name: "", surname: "", city: "", DOB: "" });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div className="create-content">
      <h3 className="create-title ">Create New User</h3>
      <form onSubmit={onSubmit} className="create-form">
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="text"
            className="form-control"
            id="email"
            value={form.email}
            onChange={(e) => updateForm({ email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name: </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={form.name}
            onChange={(e) => updateForm({ name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Surname: </label>
          <input
            type="text"
            className="form-control"
            id="surname"
            value={form.surname}
            onChange={(e) => updateForm({ surname: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="city">City: </label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={form.city}
            onChange={(e) => updateForm({ city: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="DOB">Date Of Birth: </label>
          <input
            type="date"
            className="form-control"
            id="DOB"
            value={form.DOB}
            onChange={(e) => updateForm({ DOB: e.target.value })}
          />
        </div>
        <div>
          <input
            type="submit"
            value="Create user"
            className="btn-create"
          />
        </div>
      </form>
    </div>
  );
}

