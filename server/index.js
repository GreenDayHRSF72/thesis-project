const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db-mysql/models.js');
const Yelp = require('node-yelp-fusion');
const creds = require('../apis/config.js');
const Promise = require('bluebird');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const config = require('../apis/config.js');

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
    id: config.apiConfig.yelp.appId,
    secret: config.apiConfig.yelp.appSecret,
  });

  yelp.search(queryString)
  .then((results) => {
    res.json(results);
  })
  .catch((err) => {
    res.sendStatus(500);
  });
});

app.post('suggestion/userinfo', (req, res) => {
  //console.log('the email is', req.body.email)
  db.getUserInterests(req.body.email, (err, results) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.json(results);
    }
  })
  
}); 

// app.get('/events', (req, res) => {
//   db.getPublicEvents((err, results) => {
//     if (err) {
//       console.log(err);
//       res.send(err);
//     } else {
//       console.log(results);
//       res.json(results);
//     }
//   });
// });


app.post('/users', (req, res) => {
  db.addUserToDatabase(req.body)
  .then((results) => {
    res.send('insert into users table successful');
    cSocket.emit('refresh feed', { activity: `${req.body.username}  is logged in`, authorImage: req.body.photourl });
  })
  .catch((err) => {
    res.send(err);
  });
});

app.post('/events', (req, res) => {
  db.addEvent(req.body)
  .then((results) => {
    //console.log('saving event to DB', results.insertId);
    res.json(results.insertId);
  })
  .catch((err) => {
    console.log('there is an error');
    res.send(err);
  });
});

app.get('/events/createdBy/:creatorEmail', (req, res) => {
  const email = req.params.creatorEmail;
  console.log('retrieving events created by ' + email);
  db.getEventByCreatorEmail(email)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log('err getting event by creator');
    res.send('err getting event by creator');
  });
});

app.get('/events/:participantId', (req, res) => {
  const id = req.params.participantId;
  console.log('retrieving events I get invited to ' + id);
  db.getEventByParticipantId(id)
  .then((result) => {
    res.json(result);
  })
  .catch((err) => {
    console.log('err getting event by participant id');
    res.send('err getting event by participant id');
  });
});



app.post('/participants', (req, res) => {
  const participants = req.body.friendList;
  const eventId = req.body.eventId;
  const room = req.body.eventName + eventId;
  console.log('entering participants route with room ----->', room);
  // console.log(participants);
  Promise.map(participants, function(participant) {
    //console.log(participant);
    return db.addUserToDatabase(participant)
      .then(result => {
        console.log('saving user to db');
        return db.addParticipants(eventId, participant.email);
      })
      .then(result => {
        console.log('participant saved to db');
      })
  })
  .then(result => {
    res.send('participant saved to db');
    cSocket.join(room);
    io.to(room).emit('refresh feed', { activity: `${req.body.host.name}  created an event`, authorImage: req.body.host.pic });
  })
  .catch(err => {
    res.send('err saving participant to db');
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
    console.log('cannot get user info by email from DB');
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
  let id = req.params[0];
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
      res.send('');
      cSocket.join(room);
      io.to(room).emit('refresh feed', { activity: `${req.body.eventName}: ${req.body.participantName} has RSVP'ed ${req.body.participantStatus}` });
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
