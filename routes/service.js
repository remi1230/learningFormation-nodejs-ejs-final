/**
 * Configuration des routes pour les services.
 * Chaque route est protégée par le middleware d'authentification pour s'assurer
 * que seuls les utilisateurs authentifiés peuvent effectuer des opérations.
 */

// Importation du framework Express et création d'un nouveau routeur
const express = require('express');
const router  = express.Router();

// Importation du middleware d'authentification pour sécuriser les routes,
// et du contrôleur gérant les actions sur les services
const auth        = require('../middleware/auth');
const serviceCtrl = require('../controllers/service');

//Routes
router.get('/services/json', serviceCtrl.getAllServicesInJSON);
router.get('/service/delete/:id', auth, serviceCtrl.delete);
router.get('/service/:id', serviceCtrl.getServiceById);
router.post('/service/add', auth, serviceCtrl.add);
router.put('/service/upd/:id', auth, serviceCtrl.update);

// Exportation du routeur configuré pour utilisation dans l'application principale
module.exports = router;