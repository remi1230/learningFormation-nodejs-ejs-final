/**
 * Ce fichier définit les routes pour servir des pages HTML au client.
 * Chaque fonction de route envoie un fichier HTML spécifique comme réponse à la requête du client,
 * permettant l'affichage de différentes pages de l'application web.
 */

// Importation du module path pour construire des chemins de fichier
//const path = require('path');

// Routes
exports.indexPage = (req, res, next) => res.render('index', { title: 'Test page' });