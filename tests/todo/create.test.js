const { build } = require('../../junnie');
const { readFileSync} = require('fs');
const {join} = require('path');
require('tap').mochaGlobals();
require('should');




describe('for the route for todo (/todo)',

() =>
{
    let app;
    before(async() =>
    {
        app = await build();
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

        const filename =join(__dirname,'../../database.json');
        const encoding = 'utf8';
        const databaseStringContents = readFileSync(filename,encoding);
        const database = JSON.parse(databaseStringContents);

        const index = database.todos.findIndex(todo => todo.id == id);
        index.should.not.equal(-1);
        const {text: textDatabase, done:doneDatabase} = database.todos[index];
        text.should.equal(textDatabase);
        done.should.equal(doneDatabase);


        console.log('payload:',payload);
    });

}

);