module.exports = (sequelize, Sequelize) => {
    const Actor = sequelize.define("actor", {
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
      bio: {
        type: Sequelize.TEXT
      },
      dob: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      }
    });
  
    return Actor;
  };