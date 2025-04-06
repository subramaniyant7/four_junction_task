const app = require("./app");
const db = require("./models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});