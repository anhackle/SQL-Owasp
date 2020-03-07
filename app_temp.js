const https = require('https');
const fs = require('fs');
const express = require('express');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};


const app = express();
app.get("/test", function(req,res) {
    res.send("Testing is successful");
});

app.get("/", function(req,res){
    res.send("Okey guys!")
});

https.createServer(options, app).listen(8000);