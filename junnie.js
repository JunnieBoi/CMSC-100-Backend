const Fastify = require("fastify");
const {routes} = require('./route');



exports.build = async(opts = {logger:true,trustProxy:true}) =>
{
    const app = Fastify(opts);
    routes(app);
    return app;
}




