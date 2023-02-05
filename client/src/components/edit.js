import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import './edit.css'
 
export default function Edit() {
 const [form, setForm] = useState({
  email: "",
  name: "",
  surname: "",
  city: "",
  DOB: "",
 });
 const params = useParams();
 const navigate = useNavigate();
 
 useEffect(() => {
   async function fetchData() {
     const id = params.id.toString();
     const response = await fetch(`http://localhost:5000/user/${params.id.toString()}`);
 
     if (!response.ok) {
       const message = `An error has occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
 
     const record = await response.json();
     if (!record) {
       window.alert(`Record with id ${id} not found`);
       navigate("/");
       return;
     }
 
     setForm(record);
   }
 
   fetchData();
 
   return;
 }, [params.id, navigate]);
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 async function onSubmit(e) {
   e.preventDefault();
   const editedUser = {
    email: form.email,
    name: form.name,
    surname: form.surname,
    city: form.city,
    DOB: form.DOB,
   };
 
   // This will send a post request to update the data in the database.
   await fetch(`http://localhost:5000/edit/${params.id}`, {
     method: "POST",
     body: JSON.stringify(editedUser),
     headers: {
       'Content-Type': 'application/json'
     },
   });
 
   navigate("/");
 }
 
 // This following section will display the form that takes input from the user to update the data.
 return (
  <div>
  <h3 className="edit-title">Update User</h3>
  <form onSubmit={onSubmit}>
    <div className="form-group">
      <label htmlFor="email">Email </label>
      <input
        type="text"
        className="form-control"
        id="email"
        value={form.email}
        onChange={(e) => updateForm({ email: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label htmlFor="name">Name </label>
      <input
        type="text"
        className="form-control"
        id="name"
        value={form.name}
        onChange={(e) => updateForm({ name: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label htmlFor="surname">Surname </label>
      <input
        type="text"
        className="form-control"
        id="surname"
        value={form.surname}
        onChange={(e) => updateForm({ surname: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label htmlFor="city">City </label>
      <input
        type="text"
        className="form-control"
        id="city"
        value={form.city}
        onChange={(e) => updateForm({ city: e.target.value })}
      />
    </div>
    <div className="form-group">
      <label htmlFor="DOB">Date Of Birth </label>
      <input
        type="date"
        className="form-control"
        id="DOB"
        value={form.DOB}
        onChange={(e) => updateForm({ DOB: e.target.value })}
      />
    </div>
    <div className="form-group">
      <input
        type="submit"
        value="Update User"
        className="btn-update"
      />
    </div>
  </form>
</div>
 );
}