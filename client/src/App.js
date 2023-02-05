import React from "react";
import './App.css'

// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";

// We import all the components we need in our app
import UserList from "./components/userList"
import Edit from "./components/edit";
import Create from "./components/create";
import Details from "./components/details";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<UserList />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/user/:id" element={<Details />} />
        <Route path="/user/:id/insc" element={<Details />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
};

export default App;
