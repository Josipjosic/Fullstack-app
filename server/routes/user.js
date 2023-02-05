const express = require("express");
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
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

// This section will help you get a list of all the records.
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

// This section will help you get a single record by id
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
    bp.bpj.map((data) => {
      if (result.city === data.city) {
        basePrice = data.amount;
      } else if (
        !result.city.includes("Zadar") &&
        !result.city.includes("zadar") &&
        !result.city.includes("Zagreb") &&
        !result.city.includes("zagreb") &&
        !result.city.includes("Osijek") &&
        !result.city.includes("osijek") &&
        !result.city.includes("Rijeka") &&
        !result.city.includes("rijeka") &&
        !result.city.includes("Split") &&
        !result.city.includes("split")
      ) {
        basePrice = 700;
      }
    });
  });
});

recordRoutes.route("/user/:id/insc").get(function (req, res) {
  if (age > 0 && age < 21) {
    discount = disc.discount[0].discount;
  } else if (age > 20 && age <= 30) {
    discount = disc.discount[1].discount;
  } else if (age >= 30 && age <= 40) {
    discount = disc.discount[2].discount;
  } else if (age >= 40 && age <= 60) {
    discount = disc.discount[3].discount;
  } else if (age >= 60 && age <= 200) {
    discount = disc.discount[4].discount;
  }
  let calcs = basePrice + (basePrice * discount) / 100;
  inscurance = calcs;
  res.status(200).json(inscurance);
});

// This section will help you create a new record.
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

// This section will help you update a record by id.
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

// This section will help you delete a record
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
