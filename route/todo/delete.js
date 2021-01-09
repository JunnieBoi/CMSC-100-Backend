const {getTodos} = require('../../lib/lib.create');
const {join} = require('path');



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
        if(index < 0)
        {
            return response
                .code(400)
                .send({
                    success: false,
                    code: 'todo/malformed',
                    message: 'Todo doesn\'t exist'
                });
        }
        todos.splice(index,1);
        const newdatabaseStringContents = JSON.stringify(database,null,2);
        writeFileSync(filename,newdatabaseStringContents,encoding);
        return{
            success:true,
        };
        
    });
};