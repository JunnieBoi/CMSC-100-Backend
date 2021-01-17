const { build } = require("../junnie");
const { mongoose } = require("../db");
require("tap").mochaGlobals();
require("should");

describe("for the route for (/)", () => {
  let app;
  before(async () => {
    app = await build({
      logger: false,
      trustProxy: false,
    });
  });

  after(async () => {
    // close the connection to the database
    await mongoose.connection.close();
  });
  it("it should return {success:true} with method GET", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    const payload = response.json();
    const { statusCode } = response;
    const { success } = payload;
    success.should.equal(true);
    statusCode.should.equal(200);
    console.log("payload:", payload);
  });
});
