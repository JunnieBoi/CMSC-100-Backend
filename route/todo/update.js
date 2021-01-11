const { Todo } = require('../../db');



exports.update = (app) =>
{
    app.put('/todo/:id',async (request,response) =>
    {
        const {params, body} = request;
        const {id} = params;
        const {text, done} = body || {};

        

        if(!text && (done === null || done === undefined))
        {
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Todo doesn\'t exist'
                });
        }


        const oldData = await Todo.findOne({ id }).exec();
        if(!oldData)
        {
            return response
                .code(404)
                .send({
                    success: false,
                    code: 'todo/not-found',
                    message: 'Todo doesn\'t exist'
                });
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
        
    });
};