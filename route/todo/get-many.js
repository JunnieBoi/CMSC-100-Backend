const {getTodos} = require('../../lib/lib.create');
const {join} = require('path');



exports.getMany = (app) =>
{
    app.get('/todo',(request) =>
    {
        const {query} = request;
        const {limit = 3,startDate} = query;
        const filename = join(__dirname, '../../database.json');
        const encoding = 'utf8';
        const todos = getTodos(filename,encoding);
        const data = [];
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