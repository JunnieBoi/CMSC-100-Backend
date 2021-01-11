const { Todo } = require('../../db');


exports.getMany = (app) =>
{
    app.get('/todo',async (request) =>
    {
        const {query} = request;
        const {limit = 3,startDate} = query;
    
        const options = startDate? 
        {
            dateUpdated: 
            {
            $gte: startDate
            }
        }

      : {};

        const data = await Todo
        .find(options)
        .limit(parseInt(limit))
        .sort({
          dateUpdated: -1
        })
        .exec();
  
        return{
            success:true,
            data
        };
        
    });
};