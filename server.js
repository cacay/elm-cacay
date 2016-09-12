var express = require("express");
var compression = require('compression')
var bodyParser = require('body-parser')

var app = express(); // create a new instance of express

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }))

// This is for serving files in the main directory
app.get("/", function (request, response) {
    response.sendFile("dist/index.html");
});

app.use(express.static('dist'));

// Initialize the server, bind listen port 8889
app.listen(8889);
