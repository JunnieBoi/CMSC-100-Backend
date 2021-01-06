const {create} = require('./create');
const { getMany } = require('./get-many');
const {get} = require('./get');
exports.todo = (app) =>
{
    create(app);
    getMany(app);
    get(app);
}
