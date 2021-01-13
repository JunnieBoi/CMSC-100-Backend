const { create } = require('./create');
const { login } = require('./login');

exports.user = app => {
  create(app);
  login(app);
}
