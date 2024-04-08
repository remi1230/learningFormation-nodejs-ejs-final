//Importation des modèles représentant la structure des données en BDD
const { Service, Schedules, News } = require('../model/index');

async function getAllServices(req) {
    return await Service.findAll({
        where: { obsolete: 0 },
        order: [['name', 'ASC']]
    })
}

async function getAllSchedules(req) {
    return await Schedules.findAll()
}

async function getAllNews(req) {
    return await News.findAll({
        order: [['title', 'ASC']]
    })
}

module.exports = { getAllServices, getAllSchedules, getAllNews };