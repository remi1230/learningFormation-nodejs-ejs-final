//Importation des modèles représentant la structure des données en BDD pour les tables service et user
const { Service, User, Appointment } = require('../model/index'); 

/**
 * Crée un nouveau service avec le nom et la description fourni dans le corps de la requête.
 * Sauvegarde le nouveau service dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de création réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.add = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json( { error: "You must be a professional to add a service!" })};

    const name        = req.body.name;
    const description = req.body.description;
    const detail      = req.body.detail;
    Service.create({
        name        : name,
        description : description,
        detail      : detail,
        obsolete    : false,
    })
    .then(() => { res.status(201).json({message: 'Service enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 /**
 * Met à jour un service existant avec le nom et la description fournis dans le corps de la requête.
 * Recherche le service par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `params` doit contenir `id`, et `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.update = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "You must be a professional to update a service!" })};

    const id          = req.params.id;
    const name        = req.body.name;
    const description = req.body.description;
    const detail      = req.body.detail;
    const obsolete    = req.body.obsolete;

    Service.findByPk(id)
    .then(service => {
        if (!service) {
            return res.status(404).json({error: 'Service non trouvé !'});
        }

        // Mise à jour avec la vérification correcte pour 'obsolete'
        const updateValues = {
            name        : name !== undefined ? name : service.name,
            description : description !== undefined ? description : service.description,
            detail      : detail !== undefined ? detail : service.detail,
        };
        
        // Vérifie explicitement si 'obsolete' est présent dans le corps de la requête
        if (req.body.hasOwnProperty('obsolete')) {
            updateValues.obsolete = obsolete;
        }

        service.update(updateValues)
        .then(() => res.status(200).json({message: 'Service mis à jour !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Récupère un service
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getServiceById = (req, res, next) => {
    Service.findByPk(req.params.id, {include: [
        {
            model: User,
            attributes: ['id']
        },
        {
            model: Appointment,
            attributes: ['id']
        }
    ]})
    .then(service => {
        if (!service) {
            return res.status(404).json({error: 'Service non trouvé !'});
        }
        const isUsed = (service.Users && service.Users.length > 0) || (service.Appointments && service.Appointments.length > 0);
        
        return res.status(200).json({service, isUsed});
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Récupère tous les services
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAllServices = (req, res, next) => {
    return Service.findAll({
        where: { obsolete: 0 },
        order: [['name', 'ASC']]
    })
};

/**
 * Récupère tous les services et les retourne en JSON
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAllServicesInJSON = (req, res, next) => {
    return Service.findAll({
        order: [['name', 'ASC']]
    })
    .then(services => {
        if (!services) {
            return res.status(404).json({error: 'Aucun service en base !'});
        }
        return res.status(200).json({services});
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Récupère tous les services et les professionnels associés
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAllServicesWithPro  = () => {
    return Service.findAll({
        where: { obsolete: 0 },
        order: [['name', 'ASC']],
        include: User,
        logging: console.log
    });
};

/**
 * Supprime un service en base
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.delete = (req, res, next) => {
    const id = req.params.id; // ou une autre logique pour obtenir l'ID
  
    // Modèle Sequelize pour l'objet que vous voulez supprimer, par exemple 'Item'
    Service.destroy({
      where: { id: id } // condition de correspondance
    })
    .then(result => {
      if (result === 0) {
        // Aucun objet trouvé avec cet ID, ou rien à supprimer
        return res.status(404).json({ message: 'Service non trouvé' });
      }
      // La suppression a été effectuée
      res.status(200).json({ message: 'Service supprimé avec succès !' });
    })
    .catch(error => {
      // Gérer l'erreur
      res.status(500).json({ message: 'Une erreur est survenue durant la suppression', error });
    });
};
  


