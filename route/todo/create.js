const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, PostTodoRequest } = definitions;

exports.create = (app) =>
{
    app.post('/todo',{

        schema: {
            description: 'Create one todo',
            tags: ['Todo'],
            summary: 'Create one todo',
            body: PostTodoRequest,
            response: {
              200: GetOneTodoResponse
            }
          },
      
        handler: async (request,response) =>
        {
            
            const {body} = request;
            const {text, done = false} = body;
            // if(!text)
            // {
            //     return response
            //     .code(400)
            //     .send({
            //         success: false,
            //         code: 'todo/malformed',
            //         message: 'Payload doesn\'t have text property'
            //     });
            
            // }


            const data = new Todo({
                text,
                done 
            });

           await data.save();
            return{ success: true,data};
        }
    });
}