const { Todo } = require('../../db');
const { definitions } = require('../../definitions');
const { GetManyTodoResponse, GetManyTodoQuery } = definitions;


exports.getMany = app => {
  app.get('/todo', {
    schema: {
      description: 'Gets many todos',
      tags: ['Todo'],
      summary: 'Gets many todos',
      query: GetManyTodoQuery,
      response: {
        200: GetManyTodoResponse
      },
      security: [
        {
          bearer: []
        }
      ]

    },

    preHandler: app.auth([
      app.verifyJWT
    ]),


    handler: async (request) => {
      const { query, user } = request;
      const { username } = user;
      const { limit = 3, startDate, endDate } = query;

      const options = {
        username
      };


      if (startDate) {
        options.dateUpdated = {};
        options.dateUpdated.$gte = startDate;
      }

      if (endDate) {
        options.dateUpdated = options.dateUpdated || {};
        options.dateUpdated.$lte = endDate;
      }

      const data = await Todo
        .find(options)
        .limit(parseInt(limit))
        .sort({
          dateUpdated: startDate && !endDate ? 1 : -1
        })
        .exec();

      if (startDate && !endDate) {
        data.sort((prev, next) => next.dateUpdated - prev.dateUpdated)
      }

      return {
        success: true,
        data
      };
    }
  });
};