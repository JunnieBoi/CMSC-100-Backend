const { create } = require('./create');
const { login } = require('./login');
const { auth } = require('./auth');
const { logout } = require('./logout');
exports.user = app => {
  create(app);
  login(app);
  auth(app);
  logout(app);
}
