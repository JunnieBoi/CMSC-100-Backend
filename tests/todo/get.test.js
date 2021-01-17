const { build } = require("../../junnie");
require("tap").mochaGlobals();
const should = require("should");
const { delay } = require("../../lib/delay");
const { mongoose, Todo, User } = require("../../db");

describe("get todos (/todo)", () => {
  let app;
  let authorization = "";
  const ids = [];

  before(async () => {
    app = await build();
    const payload = {
      username: "testuser3",
      password: "password1234567890",
    };

    await app.inject({
      method: "POST",
      url: "/user",
      payload,
    });

    const response = await app.inject({
      method: "POST",
      url: "/login",
      payload,
    });
    const { data: token } = response.json();

    authorization = `Bearer ${token}`;

    for (let i = 0; i < 1; i++) {
      const response = await app.inject({
        method: "POST",
        url: "/todo",
        headers: {
          authorization,
        },
        payload: {
          text: `Todo ${i}`,
          done: false,
        },
      });
      const payload = response.json();
      const { data } = payload;
      const { id } = data;
      ids.push(id);
      await delay(1000);
    }
  });

  after(async () => {
    for (const id of ids) {
      await Todo.findOneAndDelete({ id });
    }
    await User.findOneAndDelete({ username: "testuser3" });
    await mongoose.connection.close();
  });

  it("it should return {success:true, data: array of todos} with method GET, statusCode is 200, has a limit of 3 items", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/todo/${ids[0]}`,
      headers: {
        authorization,
      },
    });
    const payload = response.json();
    const { statusCode } = response;
    const { success, data } = payload;
    const { text, done, id } = data;
    success.should.equal(true);
    statusCode.should.equal(200);

    const todo = await Todo.findOne({ id }).exec();

    text.should.equal(todo.text);
    done.should.equal(todo.done);
    todo.should.equal(todo.id);
  });

  it("it should return {success:false, data: error message} with method GET, statusCode is 404", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/todo/non-existing-ID`,
      headers: {
        authorization,
      },
    });
    const payload = response.json();
    const { statusCode } = response;
    const { success, code, message } = payload;

    success.should.equal(false);
    statusCode.should.equal(404);

    should.exists(code);
    should.exists(message);
  });
});
