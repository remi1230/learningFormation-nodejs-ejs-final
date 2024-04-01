const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importation des définitions de modèle
const Patient     = require('./patient')(sequelize, Sequelize);
const Appointment = require('./appointment')(sequelize, Sequelize);
const Service     = require('./service')(sequelize, Sequelize);
const News        = require('./news')(sequelize, Sequelize);
const Schedule    = require('./schedule')(sequelize, Sequelize);

// Associations
Patient.hasMany(Appointment, { foreignKey: 'patientId' });
Appointment.belongsTo(Patient, { foreignKey: 'patientId' });

Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });

// Exportation de l'instance sequelize et des modèles
module.exports = {
  sequelize,
  Sequelize,
  Patient,
  Appointment,
  Service,
  News,
  Schedule
};
