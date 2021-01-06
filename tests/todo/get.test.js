const { build } = require('../../junnie');
const { writeFileSync} = require('fs');
const {join} = require('path');
const {getTodos} = require('../../lib/lib.create');
require('tap').mochaGlobals();
const should = require('should');
require('../../lib/delay');
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
        for(let i = 0; i < 1; i++)
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

    it('it should return {success:true, data: array of todos} with method GET, statusCode is 200, has a limit of 3 items',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:`/todo/${ids[0]}`,
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        


        console.log('payload:',payload);
        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });



    it('it should return {success:true, data: array of todos} with method GET, statusCode is 404',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:`/todo/${ids[0]}`,
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        const {text,done,id} = data;
        success.should.equal(false);
        statusCode.should.equal(404);
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        const todo = todos[index];
        


        console.log('payload:',payload);
        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
        should.exists(code);
        should.exists(message);
    });


    
});