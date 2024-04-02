module.exports = (sequelize, DataTypes) => {
  class Appointment extends DataTypes.Model {}

  Appointment.init({
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Appointment'
  });

  return Appointment;
}
