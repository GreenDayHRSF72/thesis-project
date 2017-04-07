var express = require('express');
var app = express();
var PORT = process.env.PORT || 6000;

// add handlers below
app.get('/', (req, res) => {
	res.send('you got the server');
});

app.listen(PORT, () => {
	console.log('Listening to mobile server on port ' + PORT);
});