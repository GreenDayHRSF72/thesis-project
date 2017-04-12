const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db-mysql/models.js');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const PORT = process.env.PORT || 5000;

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

app.post('/users', (req, res) => {
  console.log(req.body);
  db.addUserToDatabase(req.body)
  .then((results) => {
    console.log(results);
    res.send('insert into users table successful');
  })
  .catch((err) => {
    console.log('hello err======>');
    res.send(err);
  });
});
  // db.addUserToDatabase('', (err, results) => {
  //    if (err) {
  //     console.log(err);
  //     res.send(err);
  //   } else {
  //     console.log(results);
  //     res.send('insert into users table successful');
  //   }
  // });

io.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);
  socket.emit('news', { hi: 'there' });
  socket.emit('refresh feed', { activity: 'trying to send an activity to activity feed' });
  socket.on('user logged in', (data) => {
    console.log(data);
  });
});



http.listen(PORT, () => {
	console.log(`Listening to web server on port ${PORT}`);
});