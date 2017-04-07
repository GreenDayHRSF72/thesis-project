var express = require('express');
var app = express();
var PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {

});

app.get('/test', (req, res) => {

});

app.listen(PORT, () => {
	console.log('Listening to web server on port ${PORT}');
});