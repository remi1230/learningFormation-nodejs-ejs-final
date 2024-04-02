//Importation du modèle représentant la structure des données en BDD pour la table service
const db      = require('../model');
const Service = db.Service;

/**
 * Crée un nouveau service avec le nom et la description fourni dans le corps de la requête.
 * Sauvegarde le nouveau service dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `name`, le nom du nouveau service.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de création réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.add = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json( { error: "You must be a professional to add a service!" })};

    const name        = req.body.name;
    const description = req.body.description;
    Service.create({
        name        : name,
        description : description,
        obsolete    : false,
    })
    .then(() => { res.status(201).json({message: 'Service enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };