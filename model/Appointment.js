module.exports = (sequelize, DataTypes) => {
  class Appointment extends DataTypes.Model {}

  Appointment.init({
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Appointment'
  });

  return Appointment;
}
