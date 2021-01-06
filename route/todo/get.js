const {getTodos} = require('../../lib/lib.create');
const {join} = require('path');



exports.get = (app) =>
{
    app.get('/todo/:id',(request) =>
    {
        const {params} = request;
        const {id} = params;
        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const data = todos[index];
        todos.sort((prev,next) => prev.dateUpdated - next.dateUpdated);
        for(const todo of todos)
        {
            if(!startDate || startDate <= todo.dateUpdated)
            {
                if(data.length < limit)
                {
                    data.push(todo);
                }
            } 
        }
        data.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
        return{
            success:true,
            data
        };
        
    });
};