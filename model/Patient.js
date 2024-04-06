module.exports = (sequelize, DataTypes) => {
  class Patient extends DataTypes.Model {}

  Patient.init({
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
    }
  }, {
    sequelize,
    modelName: 'Patient'
  });

  return Patient;
};