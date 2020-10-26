const {build} = require("./junnie");

async function start() {
    const server = await build();
    const port = parseInt(process.env.PORT || '8080');
    const address = "0.0.0.0";

    const addr = await server.listen(port,address);
    console.log(`Listening on ${addr}`);
}


start();