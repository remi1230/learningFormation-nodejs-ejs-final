const express = require('express');
const router  = express.Router();

const mainCtrl  = require('../controllers/main');

router.get('/', mainCtrl.indexPage);
router.get('/takeAppointment', mainCtrl.takeAppointmentPage);
router.get('/cabinet', mainCtrl.cabinetPage);
router.get('/connexion', mainCtrl.connexionPage);

module.exports = router;