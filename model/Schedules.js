module.exports = (sequelize, DataTypes) => {
  class Schedules extends DataTypes.Model {}

  Schedules.init({
    dayOfWeek: {
      type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
      allowNull: false,
      unique: true
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Schedule'
  });

  return Schedules;
}
