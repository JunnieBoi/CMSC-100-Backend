const { mongoose, User } = require("../../db");
const { build } = require("../../app");
const should = require("should");
require("tap").mochaGlobals();

describe("For the route for creating a user POST: (/user)", () => {
  let app;
  const usernames = [];

  before(async () => {
    app = await build();
  });

  after(async () => {
    for (const username of usernames) {
      await User.findOneAndDelete({ username });
    }

    await mongoose.connection.close();
  });

  it("it should return { success: true, data: (new user object) } and has a status code of 200 when called using POST", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "user01",
        password: "password1234567890",
      },
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;
    const { username } = data;

    success.should.equal(true);
    statusCode.should.equal(200);
    username.should.equal("user01");

    const { username: usernameDatabase } = await User.findOne({
      username,
    }).exec();

    username.should.equal(usernameDatabase);

    usernames.push(username);
  });

  it("it should return { success: false, message: error message } and has a status code of 400 when called using POST, no username is inputted", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        password: "password1234567890",
      },
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, message } = payload;

    statusCode.should.equal(400);
    // success.should.equal(false);
    should.exist(message);
  });

  it("it should return { success: false, message: error message } and has a status code of 400 when called using POST, no password is inputted", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
      payload: {
        username: "user02",
      },
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, message } = payload;

    statusCode.should.equal(400);
    // success.should.equal(false);
    should.exist(message);
  });

  it("it should return { success: false, message: error message }, has a status code of 400 when called using POST, no payload is inputted", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/user",
    });

    const payload = response.json();
    const { statusCode } = response;
    const { success, message } = payload;

    statusCode.should.equal(400);
    // success.should.equal(false);
    should.exist(message);
  });
});
