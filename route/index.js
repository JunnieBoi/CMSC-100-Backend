const {todo} = require('./todo');

exports.routes = (app) =>
{
    app.get('/',{

        handler: async (req) => {
            console.log(req);
            return {success:true}
        }
    });
    todo(app);
}
