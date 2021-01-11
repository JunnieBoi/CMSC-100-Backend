const { build } = require('../../junnie');
require('tap').mochaGlobals();
require('should');
const { delay } = require('../../lib/delay');
const { mongoose, Todo } = require('../../db');




describe('get todos (/todo)',

() =>
{
    let app;
    const ids = [];
    
    before(async() =>
    {
        
        app = await build();    
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
    });

    after(async()=>
    {
        for (const id of ids)
        {
            await Todo.findOneAndDelete({ id });
        }
        await mongoose.connection.close();
    });

    it('it should return {success:true, data:todo} with method GET, statusCode is 200, has a limit of 3 items',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:'/todo'
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(3);

        
      
        for(const todo of data)
        {
        const {text,done,id} = todo;
        const 
        {
            text: textDatabase,
            done: doneDatabase
        } = await Todo
            .findOne({ id })
            .exec();
    
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        
        }

    });


    it('it should return {success:true, data:array of todos} with method GET, statusCode is 200, has a limit of 2 items',async() =>
    {
        const response = await app.inject({
            method: 'GET',
            url:'/todo?limit=2'
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        success.should.equal(true);
        statusCode.should.equal(200);
        data.length.should.equal(2);

        

        for(const todo of data)
        {
        const {text,done,id} = todo;
        const 
        {
            text: textDatabase,
            done: doneDatabase
        } = await Todo
            .findOne({ id })
            .exec();
    
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        
        }

    });


    it('it should return {success:true, data:array of todos} with method GET, statusCode is 200, has a limit of 3 items (in descending order)',async() =>
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
        const todos = await Todo
      .find()
      .limit(3)
      .sort({
        dateUpdated: -1
      })
      .exec();

        todo = todos[0];
        const responseTodo = data[0];
        todo.id.should.equal(responseTodo.id);
    });




    it('it should return {success:true, data:array of todos} with method GET, statusCode is 200, has a limit of 3 items (in descending order) and the item is updated on or after startDate',async() =>
    {
       
        const id = ids[parseInt(Math.random() * ids.length)];

        const { dateUpdated: startDate } = await Todo
        .findOne({ id })
        .exec();

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