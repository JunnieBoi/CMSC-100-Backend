const { build } = require('../../junnie');
const { writeFileSync} = require('fs');
const {join} = require('path');
const {getTodos} = require('../../lib/lib.create');
require('tap').mochaGlobals();
const should = require('should');




describe('for the route for todo (/todo)',

() =>
{
    let app;
    const ids = [];
    const filename = join(__dirname,'../../database.json');
    const encoding = 'utf8';
    
    before(async() =>
    {
        app = await build();
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
    it('it should return {success:true, data: (new todo object)} with method GET',async() =>
    {
        const response = await app.inject({
            method: 'POST',
            url:'/todo',
            payload: {
                text: "This is a todo",
                done: false
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal("This is a todo");
        done.should.equal(false);

        
      
        const database = getTodos(filename,encoding);

        const index = database.findIndex(todo => todo.id == id);
        index.should.not.equal(-1);
        const {text: textDatabase, done:doneDatabase} = database[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        


        console.log('payload:',payload);
    });

    it('it should return {success:true, data: (new todo object)} with method GET. Default value for done is false without manually initializing its value',async() =>
    {
        const response = await app.inject({
            method: 'POST',
            url:'/todo',
            payload: {
                text: "This is a todo 2",
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal("This is a todo 2");
        done.should.equal(false);

       
        const database = getTodos(filename,encoding);

        const index = database.findIndex(todo => todo.id == id);
        index.should.not.equal(-1);
        const {text: textDatabase, done:doneDatabase} = database[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        ids.push(id);

        console.log('payload:',payload);
    });


    it('It should return {success:false} and statusCode should return 400 since no text was given',async() =>
    {
        const response = await app.inject({
            method: 'POST',
            url:'/todo',
            payload: {
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,message} = payload;

        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);

       
       
    });

    it('It should return {success:false} and statusCode should return 400 since no payload was given',async() =>
    {
        const response = await app.inject({
            method: 'POST',
            url:'/todo',
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,message} = payload;

        success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);

       
       
    });
});