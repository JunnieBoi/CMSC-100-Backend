const {v4:uuid} = require('uuid');
const {readFileSync, writeFileSync} = require('fs');
const {join} = require('path');
exports.create = (app) =>
{
    app.post('/todo',{

        handler: async (req) =>
        {
            const id = uuid();
            const {body} = req;
            const {text, done = false} = body || {};

            const filename =join(__dirname,'../../database.json');
            const encoding = 'utf8';
            const databaseStringContents = readFileSync(filename,encoding);
            const database = JSON.parse(databaseStringContents);

            const data = {
                id,
                text,
                done,
                dateCreated: new Date().getTime(),
                dateUpdated: new Date().getTime()
            };
            database.todos.push(data);

            const newdatabaseStringContents = JSON.stringify(database,null,2);
            writeFileSync(filename,newdatabaseStringContents,encoding);

            return{ success: true,data};
        }
    });
}