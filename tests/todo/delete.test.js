const { build } = require('../../junnie');
require('tap').mochaGlobals();
const should = require('should');
const {delay} = require('../../lib/delay');
const { mongoose, Todo } = require('../../db');



describe('delete todos (/todo)',

() =>
{
    let app;
    const ids = [];
    
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
        for (const id of ids)
        {
            await Todo.findOneAndDelete({ id });
        }
        await mongoose.connection.close();
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
        
        
      
        const todo = await Todo
        .findOne({ id })
        .exec();

        should.not.exists(todo);

        
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