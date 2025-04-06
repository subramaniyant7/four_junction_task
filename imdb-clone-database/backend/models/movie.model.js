module.exports = (sequelize, Sequelize) => {
    const Movie = sequelize.define("movie", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
        }
      },
      year_of_release: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
          min: 1888, 
          max: new Date().getFullYear() + 5
        }
      },
      plot: {
        type: Sequelize.TEXT
      },
      poster: {
        type: Sequelize.STRING,
        validate: {
          isUrl: true
        }
      }
    });
  
    return Movie;
  };