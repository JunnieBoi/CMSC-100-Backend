const {todo} = require('./todo');
const { definitions } = require('../definitions');
const { SuccessResponse } = definitions;
const { user } = require('./user');


exports.routes = (app) =>
{
    
    app.get('/',{
        
        schema: {
            description: 'Server root route',
            tags: ['Root'],
            summary: 'Server root route',
            response: {
              200: SuccessResponse
            }
          },
      
        handler: async (req) => {
            console.log(req);
            return {success:true}
        }
    });
    todo(app);
    user(app);
}
