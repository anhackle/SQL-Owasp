//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();
app.disable('etag');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "secret_db"
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    query = `select * from secret_db.items where released=1`;
    con.query(query, function(err,  results) {
        if (err){
            res.send(err.sqlMessage);
        }else{
            res.render("start", {results:results});
        }
    });
});

app.get("/filter", function(req,res){
    var category = req.query.category;
    query = `select * from secret_db.items where type= '${category}' and released=1;`
    console.log(query);
    con.query(query,function(err, results){
        if (err){
            res.send(err.sqlMessage);
        }else{
            res.render("start", {results:results});
        }
    });
});


app.get("/login", function (req, res) {
    var login_failed = 1;
    res.render("login", {login_failed:login_failed});
});

app.get("/register", function (req, res) {
    res.render("register");
});

app.get("/secrets", function (req, res) {
    res.render("secrets");
}) 

app.post("/register", function (req, res) {});

app.post("/login", function (req, res) {
    username = req.body.username;
    password = req.body.password;
    query = `select * from secret_db.users where username='${username}' and password='${password}';`;
    con.query(query, function(error, results){
        if (error){
            res.send(error.sqlMessage);
        }else{
            if (results.length > 0){
                res.render("secrets");
            }else{
                var login_failed = 0;
                res.render("login", {login_failed:login_failed});
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
})
