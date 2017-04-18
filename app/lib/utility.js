const formatTime = (time) => {
  const sliced = time.substring(0, time.length - 3);
  return `${sliced}:00`;
};

const addParticipantsToDB = (eventId, friendList, host, eventName) => {
  return fetch('http:127.0.0.1:5000/participants', {
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
