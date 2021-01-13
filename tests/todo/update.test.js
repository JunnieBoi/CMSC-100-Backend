const { build } = require('../../junnie');
require('tap').mochaGlobals();
const should = require('should');
const {delay} = require('../../lib/delay');
const { mongoose, Todo } = require('../../db');
const { mongoose, Todo, User } = require('../../db');



describe('update todos using PUT(/todo)',

() =>
{
    let app;
    let authorization = '';
    const ids = [];
    const payload = {
        username: 'testuser4',
        password: 'password1234567890'
      }
  
      await app.inject({
        method: 'POST',
        url: '/user',
        payload
      });
  
      const response = await app.inject({
        method: 'POST',
        url: '/login',
        payload
      });
      const { data: token } = response.json();
  
      authorization = `Bearer ${token}`;
  
    before(async() =>
    {
        app = await build(
            
        );
        for(let i = 0; i < 4; i++)
        {
            const response = await app.inject({
                method: 'POST',
                url:'/todo',
                headers: {
                    authorization
                  },          
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
        await User.findOneAndDelete({ username: 'testuser4' });
        await mongoose.connection.close();
    });

    it('it should return {success:true, data:todo} with method PUT, statusCode is 200, updates the item',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[0]}`,
            headers: {
                authorization
              },      
            payload:
            {
                text:"new todo",
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todo = await Todo
                    .findOne({ id })
                    .exec();


        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });

    it('it should return {success:true, data:todo} with method PUT, statusCode is 200,updates the text only',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[1]}`,
            headers: {
                authorization
              },      
            payload:
            {
                text:"new todo 1"
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todo = await Todo
        .findOne({ id })
        .exec();
  
        

        text.should.equal('new todo 1');
        done.should.equal(false);

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });



    it('it should return {success:true, data:todo} with method PUT, statusCode is 200, updates the done item only',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[2]}`,
            headers: {
                authorization
              },      
            payload:
            {
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,data} = payload;
        const {text,done,id} = data;
        success.should.equal(true);
        statusCode.should.equal(200);
        
      
        const todo = await Todo
                    .findOne({ id })
                    .exec();


        done.should.equal(true);

        text.should.equal(todo.text);
        done.should.equal(todo.done);
        todo.should.equal(todo.id);
    });


    it('it should return {success:false, message:error message} with method PUT, statusCode is 404, the id of the todo is non-existing',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/non-existing-id`,
            headers: {
                authorization
              },      
            payload:
            {
                text:'new todo',
                done:true
            }
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;

        success.should.equal(false);
        statusCode.should.equal(404);
        
      
        should.exists(code);
        should.exists(message);
    });


    it('it should return {success:false, data:todo} with method PUT, statusCode is 400 since no payload was given',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[3]}`,
            headers: {
                authorization
              }      
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
    
        success.should.equal(false);
        statusCode.should.equal(400);

        should.exists(code);
        should.exists(message);

    });

    it('it should return {success:false, data:error message} with method PUT, statusCode is 400 since a payload exists but no text or done attribute',async() =>
    {
        const response = await app.inject({
            method: 'PUT',
            url:`/todo/${ids[3]}`,
            headers: {
                authorization
              },      
            payload:{}
        });
        const payload = response.json();
        const {statusCode} = response;
        const {success,code,message} = payload;
        
        success.should.equal(false);
        statusCode.should.equal(400);
        
      
        should.exists(code);
        should.exists(message);
    });


    
});