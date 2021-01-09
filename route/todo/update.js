const {getTodos} = require('../../lib/lib.create');
const {join} = require('path');
const {writeFileSync} = require('fs');



exports.update = (app) =>
{
    app.get('/todo/:id',(request,response) =>
    {
        const {params, body} = request;
        const {id} = params;
        const {text, done = false} = body || {};

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

        const data = todos[index];
        if(text)
        {
            data.text = text;
        }
        if(done)
        {
            data.done = done;
        }
        todos[index] = data;

        const newdatabaseStringContents = JSON.stringify(database,null,2);
        writeFileSync(filename,newdatabaseStringContents,encoding);

        return{
            success:true,
            data
        };
        
    });
};