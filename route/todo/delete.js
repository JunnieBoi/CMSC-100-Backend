const { Todo } = require('../../db');


exports.deleteOne = (app) =>
{
    app.delete('/todo/:id',async (request,response) =>
    {
        const {params} = request;
        const {id} = params;
        const data = await Todo.findOneAndDelete({id}).exec();
         if(!data) 
         {
            return response
            .code(404)
            .send({
            success: false,
            code: 'todo/not-found',
            message: 'Todo doesn\'t exist'
        });
        }


        return{
            success:true
        };
        
    });
};