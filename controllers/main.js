/**
 * Ce fichier définit les routes pour servir des pages HTML au client.
 * Chaque fonction de route envoie un fichier HTML spécifique comme réponse à la requête du client,
 * permettant l'affichage de différentes pages de l'application web.
 */

// Importation du module path pour construire des chemins de fichier
//const path = require('path');

const { getAll: getAllServices }  = require('./service');
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
