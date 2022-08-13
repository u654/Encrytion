//jshint esversion:6
require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt=require("bcrypt");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret="Thisisoursecret.";
// userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});
// userSchema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = new mongoose.model("User", userSchema);

const saltRounds=10;

app.post("/register", function(req, res) {

  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser = new User({
      email: req.body.username,
      password: hash
    });


    newUser.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  })

});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;


  User.findOne({
    email: username
  }, function(err,foundUser){
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===true){
            res.render("secrets");
          }
        });
      }
    }
  });
});







app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});


app.get("/submit", function(req, res) {
  res.render("submit");
});









app.listen(3000, function(req, res) {
  console.log("Served on port 3000.");
})
