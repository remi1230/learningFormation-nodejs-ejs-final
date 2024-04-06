module.exports = (sequelize, DataTypes) => {
  class Schedule extends DataTypes.Model {}

  Schedule.init({
    dayOfWeek: {
      type: DataTypes.ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'),
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
