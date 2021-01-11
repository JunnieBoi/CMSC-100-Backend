const Fastify = require("fastify");
const {routes} = require('./route');
const { connect } = require('./db');

exports.build = async(opts = {logger:false,trustProxy:false}) =>
{
    const app = Fastify(opts);
    await connect();
    routes(app);
    return app;
}




