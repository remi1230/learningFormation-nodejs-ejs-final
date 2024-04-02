module.exports = (sequelize, DataTypes) => {
  class User extends DataTypes.Model {}

  User.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phoneNumber: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('Patient', 'Professional'),
      allowNull: false
    },
    obsolete: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {
    sequelize,
    modelName: 'User'
  });

  return User;
};