const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/todo-cmsc100', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


exports.connect = () => new Promise((resolve, reject) => {
  const { connection } = mongoose;
  connection.on('error', reject);
  connection.once('open', resolve);
});
exports.Todo = require('./models/todo')(mongoose);
exports.User = require('./models/user')(mongoose);
exports.DiscardedToken = require('./models/discarded-tokens')(mongoose);
exports.mongoose = mongoose;
