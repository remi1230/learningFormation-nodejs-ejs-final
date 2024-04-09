/**
 * Configuration des routes pour les schedules.
 * Chaque route est protégée par le middleware d'authentification pour s'assurer
 * que seuls les utilisateurs authentifiés peuvent effectuer des opérations.
 */

// Importation du framework Express et création d'un nouveau routeur
const express = require('express');
const router  = express.Router();

// Importation du middleware d'authentification pour sécuriser les routes,
// et du contrôleur gérant les actions sur les services
const auth          = require('../middleware/auth');
const schedulesCtrl = require('../controllers/schedules');

//Routes
router.get('/schedules', schedulesCtrl.getAll);
router.get('/schedules/json', schedulesCtrl.getAllSchedulesInJSON);
router.get('/schedules/:id', schedulesCtrl.getSchedulesById);
router.get('/schedules/delete/:id', auth, schedulesCtrl.delete);
router.post('/schedules/addOrUpd', auth, schedulesCtrl.addOrUpdate);
router.delete('/schedules/deleteByDayOfWeek/:dayOfWeek', auth, schedulesCtrl.deleteByDayOfWeek);

// Exportation du routeur configuré pour utilisation dans l'application principale
module.exports = router;