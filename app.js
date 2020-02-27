//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const nodeMailer = require('nodeMailer');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ 
    extended: true 
}));
app.use(session({
    secret: "Our little secret.",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


//connect to database
mongoose.connect("mongodb://localhost:27017/userDB", { 
    useUnifiedTopology: true, useNewUrlParser: true 
});


//create User table
const userSchema = new mongoose.Schema ({
    email: String,
    password: String
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var transporter = nodeMailer.createTransport({
    host: 'smtp.mail.yahoo.com',
    port: 465,
    service: 'yahoo',
    secure: false,
    auth: {
      user: 'anlemyteam@yahoo.com',
      pass: 'zppimmponfqxtksi'
    },
    debug: false,
    logger: true
});

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req,res) {
    res.render("login"); 
});

app.get("/register", function (req, res) {
    res.render("register"); 
});

app.get("/secrets", function(req,res){
    if (req.isAuthenticated()){
        res.render("secrets");
    }else{
        res.redirect("/login");
    }
});

app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/")
});

app.get("/reset", function(req,res) {
    res.render("reset");
});

app.post("/register", function (req, res) {
    User.register({username: req.body.username},  req.body.password, function(err,  user){
        if (err){
            console.log(err);
            res.redirect("/register");
        }else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            });
        };
    });
});

app.post("/login",  function(req, res) {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if (err){
            console.log(err);
        }else{
            passport.authenticate("local")(req,res, function(){
                res.redirect("secrets");
            });
        }
    });
});

app.post("/reset", function(req,res) {
    newPassword = Math.floor(Math.random() * 1000000);
    var mailOptions = {
        from: 'anlemyteam@yahoo.com',
        to: req.body.email,
        subject: 'Reset your password !',
        html: `Your password is: ${newPassword}`
      };
    transporter.sendMail(mailOptions, function(err,info) {
        if (err) {
            console.log(err);
        }
    });

    User.findOne({username: req.body.user_mail}, function(err, user) {
        user.setPassword(newPassword.toString(), function(err) {
            if (err){
                console.log(err);
            }else{
            user.save(function(err) {
                if (err){
                    console.log(err);
                }
                else{
                    console.log("Successfully reset");
                }
            });
        }
        });
    });
    res.redirect("/login");
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
})