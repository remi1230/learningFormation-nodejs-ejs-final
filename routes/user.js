/**
 * Routes de gestion des utilisateurs.
 * 
 * Ce fichier définit les routes pour les opérations relatives aux utilisateurs dans l'application,
 * en utilisant express.Router pour organiser ces routes de manière modulaire.
 * Il inclut des routes pour l'inscription (`signup`) et la connexion (`login`) des utilisateurs,
 * ainsi qu'une route pour récupérer tous les utilisateurs ayant effectué des locations, ce qui nécessite une authentification.
 * Le middleware `auth` est utilisé pour protéger les routes sensibles et garantir que seuls les utilisateurs authentifiés peuvent accéder à certaines données.
 * Les contrôleurs spécifiés dans `userCtrl` gèrent la logique de chaque route.
 */

const express  = require('express');
const router   = express.Router();
const userCtrl = require('../controllers/user');
const auth     = require('../middleware/auth');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/patient/:id', auth, userCtrl.getPatientById);
router.get('/professional/:id', auth, userCtrl.getProfessionalById);
router.get('/professionals', auth, userCtrl.getProfessionals);
router.post('/professional/add', auth, userCtrl.addProfessional);
router.put('/professional/upd/:id', auth, userCtrl.updateProfessional);

module.exports = router;