module.exports = (sequelize, DataTypes) => {
  class User extends DataTypes.Model {
    // Ajouter des méthodes à la classe ici si nécessaire
  }

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
      defaultValue: false
    },
    // Ajouter fullName comme un attribut virtuel
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        return `${this.firstName} ${this.lastName}`;
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    // Les options comme les hooks ou les méthodes d'instance peuvent être ajoutées ici
  });

  return User;
};