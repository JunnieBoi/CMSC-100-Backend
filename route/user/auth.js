const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { SuccessResponse, PostUserRequest } = definitions;
const saltRounds = 10;

exports.auth = app => {
  app.get('/auth', {
    schema: {
      description: 'Check authentication of a user',
      tags: ['User'],
      summary: 'Check authentication of a user',
      response: {
        200: SuccessResponse
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
    handler: async () => {
      return {
        success: true
      }
    }
  })
};
