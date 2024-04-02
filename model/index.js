delete require.cache[require.resolve('../config/database')];
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importation des définitions de modèle
const User        = require('./User')(sequelize, Sequelize);
const Appointment = require('./Appointment')(sequelize, Sequelize);
const Service     = require('./Service')(sequelize, Sequelize);
const News        = require('./News')(sequelize, Sequelize);
const Schedules   = require('./Schedules')(sequelize, Sequelize);

// Associations
User.hasMany(Appointment, { foreignKey: 'userId' });
Appointment.belongsTo(User, { foreignKey: 'userId' });

Service.hasMany(Appointment, { foreignKey: 'serviceId' });
Appointment.belongsTo(Service, { foreignKey: 'serviceId' });
Service.hasMany(User, { foreignKey: 'serviceId' });
User.belongsTo(Service, { foreignKey: 'serviceId' });

User.hasMany(News, { foreignKey: 'userId' });
News.belongsTo(User, { foreignKey: 'userId' });


// Exportation de l'instance sequelize et des modèles
module.exports = {
  sequelize,
  Sequelize,
  User,
  Appointment,
  Service,
  News,
  Schedules
};
