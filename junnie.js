const Fastify = require("fastify");
const {routes} = require('./route');



exports.build = async(opts = {logger:false,trustProxy:false}) =>
{
    const app = Fastify(opts);
    routes(app);
    return app;
}




