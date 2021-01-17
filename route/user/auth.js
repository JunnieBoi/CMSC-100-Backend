const { definitions } = require("../../definitions");
const { SuccessResponse } = definitions;

exports.auth = (app) => {
  app.get("/auth", {
    schema: {
      description: "Check authentication of a user",
      tags: ["User"],
      summary: "Check authentication of a user",
      response: {
        200: SuccessResponse,
      },
      security: [
        {
          bearer: [],
        },
      ],
    },
    preHandler: app.auth([app.verifyJWT]),
    handler: async () => {
      return {
        success: true,
      };
    },
  });
};
