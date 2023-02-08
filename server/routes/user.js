const express = require("express");
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");
const bp = require("../db/basePrice.json");
const disc = require("../db/discount.json");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// this is containing data about user to calculate insurance
let basePrice = 0;
let dob = 0;
let date = new Date();
let currYear = date.getFullYear();
let age = 0;
let discount = 0;
let inscurance = 0;

// This section will help you get a list of all the users.
recordRoutes.route("/user").get(function (req, res) {
  let db_connect = dbo.getDb("users");
  db_connect
    .collection("userList")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single user by id
recordRoutes.route("/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("userList").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
    let data = new Date(result.DOB);
    let year = data.getFullYear();
    dob = year;
    age = currYear - dob;
    for (let i = 0; i < bp.bpj.length; i++) {
      let lowerCase1 =`${result.city}`.toLowerCase();
      let lowerCase2 = bp.bpj[i].city.toLowerCase();
      if (lowerCase1 === lowerCase2) {
        basePrice = bp.bpj[i].amount;
        break;
      }
      else {
        basePrice = 700;
      }
    }
  });
});

recordRoutes.route("/user/:id/insc").get(function (req, res) {
  for (let i = 0; i < disc.discount.length; i++) {
    for (let value of Object.values(disc.discount[i])) {
      val1 = value[0] + value[0];
      for (let g = 0; g <= age; g++) {
        if (g >= val1) {
          discount = disc.discount[i].discount;
        }
      }
    }
  }
  let calcs = basePrice + (basePrice * discount) / 100;
  inscurance = calcs;
  res.status(200).json(inscurance);
});

// This section will help you create a new user.
recordRoutes.route("/user/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
    city: req.body.city,
    DOB: req.body.DOB,
  };
  db_connect.collection("userList").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a user by id.
recordRoutes.route("/edit/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      city: req.body.city,
      DOB: req.body.DOB,
    },
  };
  db_connect
    .collection("userList")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a user
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("userList").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = recordRoutes;
