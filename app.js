require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

// app config
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');

//configure monogo DB
mongoose.connect("mongodb://localhost:27017/userDB");

//db schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//adding encryption
//const secret = "thisisourlittlesecret"; //moved to the .env file 
userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

//db model
const User = new mongoose.model("User", userSchema);

//app routes
app.get("/", (req, res) => {
    res.render("home")
});

app.get("/login", (req, res) => {
    res.render("login")
});

app.get("/register", (req, res) => {
   res.render("register")
});

app.post("/register", (req, res) => {
  // console.log(req.body);
    const user = new User(req.body);
    user.save((err) => {
        if (err){
            console.log(err);
        }else{
            res.render("secrets");
        }
    })
});

app.post("/login", (req, res) => {
    User.findOne(req.body, (err, user) => {
        if (err){
            console.log(err);
        }else {
            if(user){
                res.render("secrets");
            }else{
                console.log("failed to login");
                res.redirect("/login");
            }
        }
    });

});


app.listen(3000, ()=>{
    console.log("server running on port 3000");
});