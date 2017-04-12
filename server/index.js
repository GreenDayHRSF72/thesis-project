const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db-mysql/models.js');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
let cSocket;

const PORT = process.env.PORT || 5000;

// app.user(express.static('../index.ios.js'));
// TODO setup an html doc to store web version?
// deploy separate server for mobile
app.use(bodyParser.json());

io.on('connection', (socket) => {
  cSocket = socket;
  console.log('A client just joined on', socket.id);
  cSocket.emit('news', { hi: 'there' });
  // socket.emit('refresh feed', { activity: 'trying to send an activity to activity feed' });
  // socket.on('user logged in', (data) => {
  //   console.log(data);
  // });
});


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
  });
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

app.post('/users', (req, res) => {
  console.log(req.body);
  db.addUserToDatabase(req.body)
  .then((results) => {
    console.log(results);
    res.send('insert into users table successful');
    cSocket.emit('refresh feed', { activity: `${req.body.username}  is logged in`, authorImage: req.body.photourl });
  })
  .catch((err) => {
    console.log('hello err======>');
    res.send(err);
  });
});

app.get('/users/:email', (req, res) => {
  console.log('here here, get user by email');
  const email = req.params.email;
  db.getUserByEmail(email)
  .then((result) => {
    console.log('get user by email ', result[0].username);
    res.json(result[0].username);
  })
  .catch((err) => {
    console.log('cannot get user info by email from DB');
    res.send(err);
  });
});


http.listen(PORT, () => {
	console.log(`Listening to web server on port ${PORT}`);
});