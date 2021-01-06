const { build } = require('../../junnie');
const { writeFileSync} = require('fs');
const {join} = require('path');
const {getTodos} = require('../../lib/lib.create');
require('tap').mochaGlobals();
require('should');
const { delay } = require('../../lib/delay');
const { todo } = require('../../route/todo');

if(!startDate)
{
    todos.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
}
else
{
    todos.sort((prev,next) => prev.dateUpdated - next.dateUpdated);
}


describe('get todos (/todo)',

() =>
{
    let app;
    const ids = [];
    const filename =join(__dirname,'../../database.json');
    const encoding = 'utf8';
    
    before(async() =>
    {
        
        const payloads = [{
            text: 'This is a todo',
            done: false
        }];
        app = await build(
            
        );
        for(let i = 0; i < 5; i++)
        {
            const response = await app.inject({
                method: 'POST',
                url:'/todo',
                payload: {
                    text: `Todo ${i}`,
                    done: false
                }
            });
            const payload = response.json();
            const {data} = payload;
            const {id} = data;
            ids.push(id);
            await delay(1000);
        }
        
        delay(1000);
    });

    after(async()=>
    {
        const todos = getTodos(filename,encoding);
        for (const id of ids)
        {
            const index = todos.findIndex(todo => todo.id == id);
            if(index >= 0)
            {
                todos.splice(index,1);
            }

            writeFileSync(filename,JSON.stringify({todos},null,2),encoding);
        }
    });

    it('it should return {success:true, data:todo} with method GET, statusCode is 200, has a limit of 3 items',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:'/todo',
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        
      
        const database = getTodos(filename,encoding);
        for(const todo of data)
        {
        const {text,done,id} = todo;
        const index = database.findIndex(todo => todo.id == id);
        index.should.not.equal(-1);
        const {text: textDatabase, done:doneDatabase} = database[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        
        }
        


        console.log('payload:',payload);
    });



    it('it should return {success:true, data:todo} with method GET, statusCode is 200, has a limit of 3 items',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:'/todo?limit=2',
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(2);

        
      
        const database = getTodos(filename,encoding);
        for(const todo of data)
        {
        const {text,done,id} = todo;
        const index = database.findIndex(todo => todo.id == id);
        index.should.not.equal(-1);
        const {text: textDatabase, done:doneDatabase} = database[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        
        }
        


        console.log('payload:',payload);
    });



    it('it should return {success:true, data: todo} with method GET, statusCode is 200, has a limit of 3 items (in descending order)',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:'/todo',
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        
        for(let i = 0; i < data.length - 1; i++)
        {
            const prevTodo = data[i];
            const nextTodo = data[i + 1];
            (nextTodo.dateUpdated  < prevTodo.dateUpdated).should.equal(true);
        }
        const todos = getTodos(filename,encoding);
        todos.sort((prev,next) => next.dateUpdated - prev.dateUpdated);
        todo = todo[0];
        const responseTodo = data[0];
        todo.id.should.equal(responseTodo.id);
    });




    it('it should return {success:true, data: todo} with method GET, statusCode is 200, has a limit of 3 items (in descending order)',async() =>
    {
        const todos = getTodos(filename,encoding);
        const id = ids[parseInt(Math.random() * ids.length)];
        const index = todos.findIndex(todo => todo.id === id);
        const {dateUpdated: startDate} = todos[id];
        const response = await app.inject({
            method: 'GET',
            url:`/todo?startDate=${startDate}`,
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        (data.length <= 3).should.equal(true);

        
        for(let i = 0; i < data.length - 1; i++)
        {
            const prevTodo = data[i];
            const nextTodo = data[i + 1];
            (nextTodo.dateUpdated  < prevTodo.dateUpdated).should.equal(true);
        }
        data[data.length - 1].id.should.equal(id);
    });



    
   
    
});