var express = require("express");
var compression = require('compression')
var bodyParser = require('body-parser')

var app = express(); // create a new instance of express

app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }))

// This is for serving files in the main directory
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/dist/index.html");
});

app.use(express.static(__dirname + '/dist'));

// Initialize the server, listen on the provided port
var port = process.env.PORT || 8889;
console.log('Listening on port ' + port);
app.listen(port);
