/**
 * Ce fichier définit les routes pour servir des pages HTML au client.
 * Chaque fonction de route envoie un fichier HTML spécifique comme réponse à la requête du client,
 * permettant l'affichage de différentes pages de l'application web.
 */

// Importation du module path pour construire des chemins de fichier
//const path = require('path');

const { getAllServices, getAllServicesWithPro } = require('./service');
const { getAll: getAllSchedules } = require('./schedules');

//Routes
exports.indexPage = async (req, res, next) => {
    try {
        const services  = await getAllServices(req);
        const schedules = await getAllSchedules(req);

        res.render('index', {
            title: 'Test page',
            services: services,
            schedules: schedules,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue");
    }
};

exports.takeAppointmentPage = async (req, res, next) => {
    try {
        const services  = await getAllServices(req);
        const schedules = await getAllSchedules(req);

        res.render('takeAppointment', {
            title: 'Prendre RDV',
            services: services.sort((a, b) => {
                return a.name.localeCompare(b.name);
            }),
            schedules: schedules,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue");
    }
};

exports.cabinetPage = async (req, res, next) => {
    try {
        const services      = await getAllServicesWithPro(req);
        const schedules     = await getAllSchedules(req);
        console.log(JSON.stringify(services, null, 2));
        res.render('cabinet', {
            title: 'Le cabinet',
            services: services.sort((a, b) => {
                return a.name.localeCompare(b.name);
            }),
            schedules: schedules,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue");
    }
};
