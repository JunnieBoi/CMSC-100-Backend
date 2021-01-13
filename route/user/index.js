const { create } = require('./create');
const { login } = require('./login');
const { auth } = require('./auth');

exports.user = app => {
  create(app);
  login(app);
  auth(app);
}
