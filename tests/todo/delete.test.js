const { build } = require('../../junnie');
const { writeFileSync} = require('fs');
const {join} = require('path');
const {getTodos} = require('../../lib/get-todos');
require('tap').mochaGlobals();
const should = require('should');
const {delay} = require('../../lib/delay');



describe('delete todos (/todo)',

() =>
{
    let app;
    const ids = [];
    const filename =join(__dirname,'../../database.json');
    const encoding = 'utf8';
    
    before(async() =>
    {
        app = await build();
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

    it('it should return {success:true} with method DELETE, statusCode is 200.',async() =>
    {
        const response = await app.inject({
            method: 'DELETE',
            url:`/todo/${ids[0]}`
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success} = payload;
        const id = ids[0];
        success.should.equal(true);
        statusCode.should.equal(200);
        
        
      
        const todos = getTodos(filename,encoding);
        const index = todos.findIndex(todo => todo.id === id);
        index.should.equal(-1);
        
    });

   




    it('it should return {success:false, data: array of todos} with method GET, statusCode is 404',async() =>
    {
        const response = await app.inject({
            method: 'DELETE',
            url:`/todo/non-existing-ID`
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        success.should.equal(false);
        statusCode.should.equal(404);
        
        should.exists(code);
        should.exists(message);
    });


    
});