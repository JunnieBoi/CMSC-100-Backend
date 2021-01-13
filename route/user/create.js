const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { GetOneUserResponse, PostUserRequest } = definitions;
const saltRounds = 10;


exports.create = app => {
  app.post('/user', {
    schema: {
      description: 'Create one user',
      tags: ['User'],
      summary: 'Create one user',
      body: PostUserRequest,
      response: {
        200: GetOneUserResponse
      }
    },

    
    handler: async (request, response) => {
      const { body } = request;
      const { username, password } = body;

      const hash = await bcrypt.hash(password, saltRounds);

      const data = new User({
        username,
        password: hash,
      });

      await data.save();

      return {
        success: true,
        data
      }
    }
  })
};
