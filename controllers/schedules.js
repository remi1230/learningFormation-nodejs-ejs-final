//Importation du modèle représentant la structure des données en BDD pour la table schedules
const db      = require('../model');
const Schedules = db.Schedules;

const { getDayOrder } = require('../services/backoffice');

/**
 * Récupère tous les horaires
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAllSchedulesInJSON = (req, res, next) => {
    Schedules.findAll({order: [['order', 'ASC']]})
    .then(schedules => {
        if (!schedules) {
            return res.status(404).json({error: 'Aucun horaire de trouvé !'});
        }
        res.status(200).json(schedules);
    })
};

/**
 * Récupère un horaire par son ID
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getSchedulesById = (req, res, next) => {
    Schedules.findByPk(req.params.id)
    .then(schedules => {
        if (!schedules) {
            return res.status(404).json({error: 'Aucun horaire de trouvé !'});
        }
        res.status(200).json(schedules);
    })
    .catch(error => res.status(500).json({ error: 'Une erreur est survenue' })); // Gestion des erreurs
};

 /**
 * Met à jour un schedules existant ou en ajoute un nouveau.
 * Recherche le schedules par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `dayOfWeek`, `openTime` et `closeTime`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.addOrUpdate = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "You must be a professional to update a schedules!" })};

    const dayOfWeek   = req.body.dayOfWeek;
    const schedulesId = req.body.schedulesId;
    const openTime    = req.body.openTime;
    const closeTime   = req.body.closeTime;

    Schedules.findOne(dayOfWeek ? { where: { dayOfWeek: dayOfWeek } } : { where: { id: schedulesId } })
    .then(schedules => {
        if (!schedules) {
            Schedules.create({
                dayOfWeek : dayOfWeek,
                openTime  : openTime,
                closeTime : closeTime,
                order     : getDayOrder(dayOfWeek),
            })
            .then(() => { res.status(201).json({message: 'Horaire enregistré !'})})
            .catch(error => { res.status(400).json( { error })})
        }
        else{
            return schedules.update({
                openTime  : openTime,
                closeTime : closeTime,
            })
            .then(() => res.status(200).json({message: 'Horaire mis à jour !'}))
            .catch(error => res.status(400).json({error}));
        }
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Supprime un horaire existant basé sur le jour de la semaine.
 * Recherche l'horaire par son jour de la semaine fourni dans le corps de la requête et le supprime.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `dayOfWeek`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de suppression réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.deleteByDayOfWeek = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ 
        return res.status(400).json({ error: "You must be a professional to delete a schedule!" });
    }

    const dayOfWeek  = req.params.dayOfWeek;

    Schedules.findOne({ where: { dayOfWeek: dayOfWeek } })
        .then(schedule => {
            if (!schedule) {
                return res.status(404).json({error: 'Horaire pour ce jour non trouvé !'});
            }
            // Suppression de l'horaire trouvé
            return schedule.destroy()
                .then(() => res.status(200).json({message: 'Horaire supprimé !'}))
                .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(400).json({error}));
};

/**
 * Supprime un horaire en base
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.delete = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ 
        return res.status(400).json({ error: "You must be a professional to delete a schedule!" });
    }
    
    const id = req.params.id; // ou une autre logique pour obtenir l'ID
  
    // Modèle Sequelize pour l'objet que vous voulez supprimer, par exemple 'Item'
    Schedules.destroy({
      where: { id: id } // condition de correspondance
    })
    .then(result => {
      if (result === 0) {
        // Aucun objet trouvé avec cet ID, ou rien à supprimer
        return res.status(404).json({ message: 'Horaire non trouvé' });
      }
      // La suppression a été effectuée
      res.status(200).json({ message: 'Horaire supprimé avec succès !' });
    })
    .catch(error => {
      // Gérer l'erreur
      res.status(500).json({ message: 'Une erreur est survenue durant la suppression', error });
    });
};

/**
 * Récupère tous les horaires
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAll = (req, res, next) => {
    return Schedules.findAll()
};

