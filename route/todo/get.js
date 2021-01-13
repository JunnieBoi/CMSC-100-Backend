const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneTodoResponse, GetOneTodoParams } = definitions;




exports.get = (app) =>
{
    app.get('/todo/:id',{
    
        schema: {
            description: 'Get one todo',
            tags: ['Todo'],
            summary: 'Get one todo',
            params: GetOneTodoParams,
            response: {
              200: GetOneTodoResponse
            }
          },
      
    
    handler:async (request,response) =>
    {
        const {params} = request;
        const {id} = params;
        const data = await Todo.findOne({ id }).exec();
        if(!data)
        {
            return response
            .notFound('todo/not-found')
        }
        return{
            success:true,
            data
        };
        
    }
});
};