//Importation des modèles représentant la structure des données en BDD
const { Service, Schedules } = require('../model/index');

async function getAllServices(req) {
    return await Service.findAll({
        where: { obsolete: 0 },
    })
}

async function getAllSchedules(req) {
    return await Schedules.findAll()
}

module.exports = { getAllServices, getAllSchedules };