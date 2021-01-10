const {readFileSync} = require('fs');


exports.getTodos= (filename,encoding) =>
{   
    const databaseString = readFileSync(filename, encoding);
    const database = JSON.parse(databaseString);
    const {todos} = database;    
    return todos;
}