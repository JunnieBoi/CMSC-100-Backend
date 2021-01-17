const { create } = require("./create");
const { getMany } = require("./get-many");
const { get } = require("./get");
const { update } = require("./update");
const { deleteOne } = require("./delete");
exports.todo = (app) => {
  create(app);
  getMany(app);
  get(app);
  update(app);
  deleteOne(app);
};
