const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, GetOneTodoParams, PutTodoRequest } = definitions;



exports.update = (app) =>
{
    app.put('/todo/:id',
    {
    
    schema: {
        description: 'Update one todo',
        tags: ['Todo'],
        summary: 'Update one todo',
        body: PutTodoRequest,
        params: GetOneTodoParams,
        response: {
          200: GetOneTodoResponse
        }
      },
  
    
    handler: async (request,response) =>
    {
        const {params, body} = request;
        const {id} = params;
        const {text, done} = body || {};

        

        if(!text && (done === null || done === undefined))
        {
            return response
            .badRequest('request/malformed');
        }


        const oldData = await Todo.findOne({ id }).exec();
        if(!oldData)
        {
            return response
            .notFound('todo/not-found')
        }

      

        const update = {};

        if(text)
        {
            update.text = text;
        }
        if (done !== undefined && done !== null) 
        {
            update.done = done;
        }
      
        update.dateUpdated = new Date().getTime();

        const data = await Todo.findOneAndUpdate(
            { id },
            update,
            { new: true }
          )
            .exec();
      

        return{
            success:true,
            data
        };
        
    
    }
        });
};