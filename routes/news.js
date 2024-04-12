/**
 * Configuration des routes pour les news.
 * Chaque route est protégée par le middleware d'authentification pour s'assurer
 * que seuls les utilisateurs authentifiés peuvent effectuer des opérations.
 */

// Importation du framework Express et création d'un nouveau routeur
const express = require('express');
const router  = express.Router();

// Importation du middleware d'authentification pour sécuriser les routes,
// et du contrôleur gérant les actions sur les services
const auth     = require('../middleware/auth');
const multer   = require('../middleware/multer-config');
const newsCtrl = require('../controllers/news');

//Routes
router.get('/news/json', newsCtrl.getAllNewsInJSON);
router.get('/news/:id', newsCtrl.getNewsById);
router.get('/news/delete/:id', newsCtrl.delete);
router.post('/news/add', auth, multer, newsCtrl.add);
router.put('/news/upd/:id', auth, multer, newsCtrl.update);

// Exportation du routeur configuré pour utilisation dans l'application principale
module.exports = router;