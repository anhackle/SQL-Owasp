//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mysql = require('mysql');
const cookieParser = require('cookie-parser');

const app = express();

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "nguyencaothai123#",
    database: "secret_db"
});

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.disable('etag'); // Disable 304 status code.

function randomStr(len, arr) {
    var ans = '';
    for (var i = len; i > 0; i--) {
        ans += arr[Math.floor(Math.random() * arr.length)];
    }
    return ans;
}

function checkingTrackingid(trackingId, callback) {
    query = `select * from secret_db.trackedusers where trackingid = '${trackingId}';`;
    con.query(query, function (err, results) {
        if (err) {
            callback("Internal Server Error");
        }else{
            callback(true);
        }
    });
}

app.get("/", function (req, res) {
    query = `select * from secret_db.items where released=1`;
    con.query(query, function (err, results) {
        if (err) {
            res.send(err.sqlMessage);
        } else {
            cookieClient = req.cookies.trackingid;
            if (!cookieClient) {
                cookieValue = randomStr(20, 'abcdefgABCDEG1234567890');

                // Add trackingid into table
                query = `insert into secret_db.trackedusers(trackingid) values('${cookieValue}');`
                con.query(query, function (err) {
                    if (err) {
                        console.log(err);
                    }
                });

                res.cookie('trackingid', cookieValue, {
                    "path": "/",
                    "httpOnly": true,
                });
            }
            checkingTrackingid(req.cookies.trackingid, (visited) => {
                if (typeof(visited) == "string"){
                    res.send(visited);
                }else{
                    res.render("start", {
                        results: results
                    });
                }
            });
        }
    });
});

app.get("/filter", function (req, res) {
    var category = req.query.category;
    query = `select * from secret_db.items where type= ? and released=1;`
    con.query(query, [category], function (err, results) {
        if (err) {
            res.send(err.sqlMessage);
        } else {
            checkingTrackingid(req.cookies.trackingid, (visited) => {
                if (typeof(visited) == "string"){
                    res.send(visited);
                }else{
                    res.render("start", {
                        results: results
                    });
                }
            });
        }
    });
});


app.get("/login", function (req, res) {
    var login_failed = 1;
    res.render("login", {
        login_failed: login_failed
    });
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
    con.query(query, function (error, results) {
        if (error) {
            res.send(error.sqlMessage);
        } else {
            if (results.length > 0) {
                res.render("secrets");
            } else {
                var login_failed = 0;
                res.render("login", {
                    login_failed: login_failed
                });
            }
        }
    });
});

app.listen(3000, function () {
    console.log("Server is listening on port 3000");
})