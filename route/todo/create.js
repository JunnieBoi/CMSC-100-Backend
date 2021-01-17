const { Todo } = require("../../db");
const { definitions } = require("../../definitions");
const { GetOneTodoResponse, PostTodoRequest } = definitions;

exports.create = (app) => {
  app.post("/todo", {
    schema: {
      description: "Create one todo",
      tags: ["Todo"],
      summary: "Create one todo",
      body: PostTodoRequest,
      response: {
        200: GetOneTodoResponse,
      },
      security: [
        {
          bearer: [],
        },
      ],
    },
    preHandler: app.auth([app.verifyJWT]),

    handler: async (request, response) => {
      const { body, user } = request;
      const { text, done = false } = body;
      const { username } = user;
      // if(!text)
      // {
      //     return response
      //     .code(400)
      //     .send({
      //         success: false,
      //         code: 'todo/malformed',
      //         message: 'Payload doesn\'t have text property'
      //     });

      // }

      const data = new Todo({
        text,
        done,
        username,
      });

      await data.save();
      return { success: true, data };
    },
  });
};
