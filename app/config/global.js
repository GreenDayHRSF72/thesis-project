let baseURL;

// allows for multiuse url
if (process.env.NODE_ENV === 'development') {
  baseURL = 'https://hst-friend-ly.herokuapp.com';
} else if (process.env.NODE_ENV === 'staging') {
  baseURL = 'https://hst-friend-ly-staging.herokuapp.com';
} else {
  baseURL = 'http://127.0.0.1:5000';
}
module.exports = {
  baseURL,
};
