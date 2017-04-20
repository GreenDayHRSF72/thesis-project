const formatTime = (time) => {
  const sliced = time.substring(0, time.length - 3);
  return `${sliced}:00`;
};

let baseURL;

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http:/127.0.0.1:5000';
}

const addParticipantsToDB = (eventId, friendList, host, eventName) => {
  return fetch(baseURL + '/participants', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      eventId,
      friendList,
      host,
      eventName,
    }),
  })
  .then(data => console.log('successfully save participant data to DB'))
  .catch(err => console.log('error when saving participants to DB'));
};

module.exports.formatTime = formatTime;
module.exports.addParticipantsToDB = addParticipantsToDB;
