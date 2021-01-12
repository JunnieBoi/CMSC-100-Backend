const { build } = require('../../junnie');
require('tap').mochaGlobals();
const should = require('should');
const { mongoose, Todo } = require('../../db');




describe('for the route for todo (/todo)',

() =>
{
    let app;
    const ids = [];
   
    before(async() =>
    {
        app = await build();
    });

    after(async()=>
    {
        
        for (const id of ids)
        {
            await Todo.findOneAndDelete({ id });
        }
        await mongoose.connection.close();
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

        
      
        const
        {
            text: textDatabase,
            done: doneDatabase
        } = await Todo
            .findOne({ id })
            .exec();
      
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
        


        console.log('payload:',payload);
    });

    it('it should return {success:true, data: (new todo object)} with method GET. Default value for done is false without manually initializing its value',async() =>
    {
        const response = await app.inject({
            method: 'POST',
            url: '/todo',
            payload: {
                text: 'This is a todo 2'
            }
        });
    
        const payload = response.json();
        const { statusCode } = response;
        const { success, data } = payload;
        const { text, done, id } = data;
    
        success.should.equal(true);
        statusCode.should.equal(200);
        text.should.equal('This is a todo 2');
        done.should.equal(false);
    
        const 
        {
        text: textDatabase,
        done: doneDatabase
        } = await Todo
        .findOne({ id })
        .exec();
    
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);
    
        ids.push(id);
      
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

        //success.should.equal(false);
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

        //success.should.equal(false);
        statusCode.should.equal(400);
        should.exist(message);

       
       
    });
});