const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db-mysql/models.js');
const Yelp = require('node-yelp-fusion');
const Promise = require('bluebird');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

let config = require('../apis/config.js');

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  config = undefined;
}


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
  res.json('you have reached the home page');
});

// for testing out our database


// app.get('/public/events', (req, res) => {
//   // get all public events here
// })

app.post('/suggestion/yelp', (req, res) => {
  const queryString = req.body.queryString;
  const yelp = new Yelp({
    id: config.apiConfig.yelp.appId || process.env.YELP_ID,
    secret: config.apiConfig.yelp.appSecret || process.env.YELP_SECRET,
  });

  yelp.search(queryString)
  .then((results) => {
    res.json(results);
  })
  .catch((err) => {
    console.log('error from yelp suggestion', err);
    res.sendStatus(500);
  });
});

app.post('suggestion/userinfo', (req, res) => {
  db.getUserInterests(req.body.email, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(results);
    }
  });
});


app.post('/users', (req, res) => {
  db.addUserToDatabase(req.body)
  .then((results) => {
    cSocket.emit('refresh feed', { activity: `${req.body.username}  is logged in`, authorImage: req.body.photourl });
    res.send('insert into users table successful');
  })
  .error((err) => {

  })
  .catch((err) => {
    res.send(err);
  });
});

app.post('/events', (req, res) => {
  db.addEvent(req.body)
  .then((results) => {
    res.json(results.insertId);
  })
  .catch((err) => {
    console.log('there is an error');
    res.send(err);
  });
});

app.get('/events/createdBy/:creatorEmail', (req, res) => {
  const email = req.params.creatorEmail;
  console.log('retrieving events created by ', email);
  db.getEventByCreatorEmail(email)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log('err getting event by creator', err);
    res.send('err getting event by creator', err);
  });
});

app.get('/events/:participantId', (req, res) => {
  const id = req.params.participantId;
  console.log('retrieving events I get invited to ', id);
  db.getEventByParticipantId(id)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log('err getting event by participant id', err);
    res.send('err getting event by participant id', err);
  });
});


app.post('/participants', (req, res) => {
  const participants = req.body.friendList;
  const eventId = req.body.eventId;
  const room = req.body.eventName + eventId;
  console.log('entering participants route with room ----->', room);
  // console.log(participants);
  Promise.map(participants, (participant) => {
    console.log(participant);
    return db.addUserToDatabase(participant)
      .then(result => {
        console.log('saving user to db');
        return db.addParticipants(eventId, participant.email);
      })
      .then(result => {
        console.log('participant saved to db');
      });
  })
  .then(result => {
    res.send('participant saved to db');
    cSocket.join(room);
    io.to(room).emit('refresh feed', { activity: `${req.body.host.name}  created an event`, authorImage: req.body.host.pic });
  })
  .catch((err) => {
    res.send('err saving participant to db', err);
  })
  ;
});


app.get('/users/:email', (req, res) => {
  const email = req.params.email;
  db.getUserByEmail(email)
  .then((result) => {
    console.log('get user by email ', result[0].username);
    res.json(result[0]);
  })
  .catch((err) => {
    console.log('cannot get user info by email from DB', err);
    res.send(err);
  });
});


app.get('/events', (req, res) => {
  db.getPublicEvents((err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      // console.log(results);
      res.json(results);
    }
  });
});

app.get('/events/participants/list/:*', (req, res) => {
  const id = req.params[0];
  console.log('get participants for events ----->', id);
  db.getEventParticipants(id, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(results);
      res.json(results);
    }
  });
});

app.post('/events/participants/rsvp', (req, res) => {
  console.log('request for participant status update --->', req.body);
  const room = req.body.eventName + req.body.eventId;
  db.updateParticipantResponse(req.body, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log(results);
      cSocket.join(room);
      io.to(room).emit('refresh feed', { activity: `${req.body.eventName}: ${req.body.participantName} has RSVP'ed ${req.body.participantStatus}` });
      res.send('');
    }
  });
});

io.on('connection', (socket) => {
  console.log('A client just joined on', socket.id);
  socket.emit('news', { hi: 'there' });
  socket.on('user logged in', (data) => {
    console.log('socket user logged in data', data);
  });
});


http.listen(PORT, () => {
  console.log(`Listening to web server on port ${PORT}`);
});
