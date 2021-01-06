const {getTodos} = require('../../lib/lib.create');
const {join} = require('path');



exports.get = (app) =>
{
    app.get('/todo/:id',(request,response) =>
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
        const data = todos[index];
        return{
            success:true,
            data
        };
        
    });
};