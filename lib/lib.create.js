const {readFileSync} = require('fs');


exports.getTodos= (filename,encoding) =>
{
    const {todos} = JSON.parse(readFileSync(filename,encoding));    
    return todos;
}