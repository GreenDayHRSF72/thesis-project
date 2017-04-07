var express = require('express');
var bodyParser = require('body-parser');
var db = require('../db-mysql/models.js');

var app = express();
var PORT = process.env.PORT || 5000;

// app.user(express.static('../index.ios.js'));
// TODO setup an html doc to store web version?
// deploy separate server for mobile
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('you have reached the home page');
});

// for testing out our database 
app.get('/test', (req, res) => {
    db.selectAllFromTest((err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(results);
    }
  })
});
app.post('/test', (req, res) =>{
  var value = req.body.value;
  db.insertValueIntoTest(value , (err, value) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send('insert into test table successful');
    }
  });
});


app.listen(PORT, () => {
	console.log(`Listening to web server on port ${PORT}`);
});