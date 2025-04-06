const dbConfig = require("../config/db.config.js");
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;


db.movies = require("./movie.model.js")(sequelize, Sequelize);
db.actors = require("./actor.model.js")(sequelize, Sequelize);
db.producers = require("./producer.model.js")(sequelize, Sequelize);


db.movies.belongsToMany(db.actors, {
  through: "movie_actors",
  as: "actors",
  foreignKey: "movie_id"
});
db.actors.belongsToMany(db.movies, {
  through: "movie_actors",
  as: "movies",
  foreignKey: "actor_id"
});


db.movies.belongsTo(db.producers, {
  foreignKey: "producer_id",
  as: "producer"
});
db.producers.hasMany(db.movies, {
  foreignKey: "producer_id",
  as: "movies"
});

module.exports = db;