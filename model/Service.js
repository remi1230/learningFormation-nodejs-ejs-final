module.exports = (sequelize, DataTypes) => {
  class Service extends DataTypes.Model {}

  Service.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    obsolete: {
      type: DataTypes.BOOLEAN,
      default: false
    }
  }, {
    sequelize,
    modelName: 'Service'
  });

  return Service;
}
