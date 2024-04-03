module.exports = (sequelize, DataTypes) => {
  class Schedule extends DataTypes.Model {}

  Schedule.init({
    dayOfWeek: {
      type: DataTypes.ENUM('Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'),
      allowNull: false
    },
    openTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closeTime: {
      type: DataTypes.TIME,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Schedule'
  });

  return Schedule;
}
