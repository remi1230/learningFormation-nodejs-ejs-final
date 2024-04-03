//Importation du modèle représentant la structure des données en BDD pour la table schedules
const db      = require('../model');
const Schedules = db.Schedules;

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

    const dayOfWeek = req.body.dayOfWeek;
    const openTime  = req.body.openTime;
    const closeTime = req.body.closeTime;

    Schedules.findOne({ where: { dayOfWeek: dayOfWeek } })
    .then(schedules => {
        if (!schedules) {
            Schedules.create({
                dayOfWeek : dayOfWeek,
                openTime  : openTime,
                closeTime : closeTime,
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

