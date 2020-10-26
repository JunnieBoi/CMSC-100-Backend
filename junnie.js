const Fastify = require("fastify");




exports.build = async(opts = {logger:true,trustProxy:true}) =>
{
    const app = Fastify(opts);
    app.get('/',{
  
        handler: async (req) => {
            console.log(req);
            return {success:true}
        }
    });
    return app;
}




