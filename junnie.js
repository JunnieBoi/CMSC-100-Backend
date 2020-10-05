const Fastify = require("fastify");


const server = Fastify({
    logger: true,
    trustProxy: true
});


server.get('/',{
  
    handler: async (req) => {
        console.log(req);
        return {success:true}
    }
})


async function start() {
    const port = parseInt(process.env.PORT || '8080');
    const address = "0.0.0.0";

    const addr = await server.listen(port,address);
    console.log(`Listening on ${addr}`);
}


start();