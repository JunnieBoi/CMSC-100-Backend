const bcrypt = require('bcrypt');
const { User } = require('../../db');
const { definitions } = require('../../definitions');
const { LoginResponse, PostUserRequest } = definitions;

exports.login = app => {
  app.post('/login', {
    schema: {
      description: 'Logs in a user',
      tags: ['User'],
      summary: 'Logs in a user',
      body: PostUserRequest,
      response: {
        200: LoginResponse
      }
    },
   
    
    handler: async (request, response) => {
      const { body } = request;
      const { username, password } = body;

      const user = await User.findOne({ username }).exec();

      if (!(await bcrypt.compare(password, user.password))) {
        return response
          .code(401)
          .send({
            success: false,
            code: 'auth/unauthorized',
            message: 'Wrong password'
          });
      }

      return {
        success: true
      }
    }
  })
};
