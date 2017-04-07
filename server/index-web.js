var express = require('express');
var bodyParser = require('body-parser');
var db = require(/*figureout where the models are in relation to this*/);

var app = express();
var PORT = process.env.PORT || 5000;

app.user(express.static(__dirname + /*where ever our web version is */));
app.use(bodyParser.json());

app.get('/', (req, res) => {

});

// for testing out our database 
app.get('/test', (req, res) => {

});


app.listen(PORT, () => {
	console.log('Listening to web server on port ${PORT}');
});