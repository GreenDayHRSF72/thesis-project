const express = require('express');
const bodyParser = require('body-parser');
const db = require('../db-mysql/models.js');
const Yelp = require('node-yelp-fusion');
const Promise = require('bluebird');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

const Mailgun = require('mailgun-js');
/* 
const mailgun = new Mailgun({apiKey: process.env.mailgunApiKey || config.apiConfig.mailgun.ApiKey, domain: process.env.mailgunDomain || config.apiConfig.mailgun.domain});
  const data = {
    from: req.body.senderEmail,
    to: req.body.recipientEmail,
    subject: req.body.subject,
    text: req.body.message
  };
  console.log(data);
  mailgun.messages().send(data, function (err, body) {
    if (err) {
      res.render ('error', { error: err });
      console.log('got an error from mailgun API -------->', err);
    } else {
      console.log(body);
      res.send({status: 'ok'});
    }
  });

*/

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
  cSocket.on('user_id', (data) => {
    console.log('user_id from socket connection', data);
  });
  // socket.emit('refresh feed', { activity: 'trying to send an activity to activity feed' });
  // socket.on('user logged in', (data) => {
  //   console.log(data);
  // });
});


app.get('/', (req, res) => {
  res.json('you have reached the home page');
});

app.post('/suggestion/yelp', (req, res) => {
  const queryString = req.body.queryString;
  const yelp = new Yelp({
    id: process.env.YELP_ID || config.apiConfig.yelp.appId,
    secret: process.env.YELP_SECRET || config.apiConfig.yelp.appSecret,
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

// TODO: change this to a GET request
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
    // TO DO
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
    console.log('there is an error in /events post route', err);
    res.send(err);
  });
});

app.post('/activities', (req, res) => {
  db.addActivity(req.body)
  .then((results) => {
    res.send('insert into activities table successfully');
  })
  .catch((err) => {
    console.log('there is an error in /activities post route', err);
    res.send(err);
  });
});

app.get('/events/createdBy/:creatorEmail', (req, res) => {
  const email = req.params.creatorEmail;
  //console.log('retrieving events created by ', email);
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
  const formatTime = (time) => {
    const sliced = time.substring(0, time.length - 3);
    return `${sliced}:00`;
  };
  const isEventPast = (event) => {
    // 2017-02-27T08:00:00.000Z
    // 16:12:12
    // 2017-02-27T16:12:12
    const eventEndTime = formatTime(event.endTime);
    const eventDate = event.eventDate.toJSON();
    const currentTime = new Date(Date.now());
    console.log('eventTime --->', `${eventDate.substring(0, 10)}T${eventEndTime}`);
    const eventTime = new Date(`${eventDate.substring(0, 10)}T${eventEndTime}`);
    return (currentTime - eventTime > 0) ? true : false;
  };
  const id = req.params.participantId;
  console.log('retrieving events I get invited to ', id);
  db.getEventByParticipantId(id)
  .then((result) => {
    console.log('result from db query on get events by participantID -->', result);
    result.forEach((event) => {
      if (!isEventPast(event)) {
        const room = event.name + event.id;
        cSocket.join(room);
        io.to(room).emit('refresh feed', { author: event.username, activity: `invited you to ${event.name}`, authorImage: event.photourl });
      }
    });
    res.json(result);
  })
  .catch((err) => {
    console.log('err getting event by participant id', err);
    res.send('err getting event by participant id', err);
  });
});


app.post('/participants', (req, res) => {
  const participants = req.body.friendList;
  console.log('req.body for mailgun --->', req.body);
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
        const mailgun = new Mailgun({apiKey: process.env.mailgunApiKey || config.apiConfig.mailgun.apiKey, domain: process.env.mailgunDomain || config.apiConfig.mailgun.domain});
        const data = {
          from: req.body.host.email,
          to: participant.email,
          subject: 'you have been invited to an event on friend.ly',
          text: `${req.body.host.name} would like to invite you to an event. Check out our app to RSVP`,
        };
        console.log('mailgun data', data);
        mailgun.messages().send(data, (err, body) => {
          if (err) {
            res.render ('error', { error: err });
            console.log('got an error from mailgun API -------->', err);
          } else {
            console.log(body);
          }
        });
      });
  })
  .then((result) => {
    res.send('participant saved to db');
    cSocket.join(room);
    io.to(room).emit('refresh feed', { author: req.body.host.name, activity: 'created an event', authorImage: req.body.host.pic });
  })
  .catch((err) => {
    res.send(err);
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


const server = http.listen(PORT, () => {
  console.log(`Listening to web server on port ${PORT}`);
});

module.exports = server;

