const {getTodos} = require('../../lib/get-todos');
const {join} = require('path');
const {writeFileSync} = require('fs');


exports.deleteOne = (app) =>
{
    app.delete('/todo/:id',(request,response) =>
    {
        const {params} = request;
        const {id} = params;
        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
         if (index < 0) 
         {
            return response
            .code(404)
            .send({
            success: false,
            code: 'todo/not-found',
            message: 'Todo doesn\'t exist'
        });
        }


        todos.splice(index,1);
        const newdatabaseStringContents = JSON.stringify({todos},null,2);
        writeFileSync(filename,newdatabaseStringContents,encoding);
        return{
            success:true
        };
        
    });
};