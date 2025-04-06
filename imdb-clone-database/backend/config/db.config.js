module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "root@123",
    DB: "imdb_clone",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };