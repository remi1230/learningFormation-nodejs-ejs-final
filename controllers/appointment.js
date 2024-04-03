//Importation du modèle représentant la structure des données en BDD pour les tables appointment et user
const db          = require('../model');
const Appointment = db.Appointment;
const User        = db.User;

const { createUser } = require('./user');

/**
 * Crée un nouveau appointment.
 * Sauvegarde le nouveau appointment dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de création réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.add = async (req, res, next) => {
    const email = req.body.userEmail;

    try {
        let user = await User.findOne({ where: { email: email } });
        if (!user) {
            const userData = {
                firstName: req.body.userFirstName,
                lastName: req.body.userLastName,
                email: email,
                phoneNumber: req.body.userPhoneNumber,
                password: "Patient",
                role: "Patient",
                service: null
            };
            user = await createUser(userData);
        }
        const serviceId = req.body.serviceId;
        const date = req.body.date;
        const status = 'pending';

        await Appointment.create({
            userId: user.id,
            serviceId: serviceId,
            date: date,
            status: status
        });
        res.status(201).json({message: 'Appointment enregistré !'});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

 /**
 * Met à jour un appointment existant avec le nom et la description fournis dans le corps de la requête.
 * Recherche le appointment par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `params` doit contenir `id`, et `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.update = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "Seuls les professionnels peuvent modifier les appointment!" })};

    const id          = req.params.id;
    const title       = req.body.title;
    const content     = req.body.content;
    const obsolete    = req.body.obsolete;
    const newAuthorId = req.auth.userId;

    Appointment.findByPk(id)
    .then(appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Appointment non trouvé !'});
        }

        if(newAuthorId !== appointment.userId){
            return res.status(401).json({ message: "Vous devez être l'auteur de la appointment pour la modifier" });
        }

        const updateValues = {
            title    : title   !== undefined ? title   : appointment.title,
            content  : content !== undefined ? content : appointment.content,
            obsolete : obsolete !== undefined ? obsolete : appointment.obsolete,
        };
        
        appointment.update(updateValues)
        .then(() => res.status(200).json({message: 'Appointment mis à jour !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
};

 /**
 * Récupère toutes les appointment
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAll = (req, res, next) => {
    Appointment.findAll({
        where: { obsolete: 0 },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber'] // Spécifiez les attributs que vous voulez inclure de l'utilisateur
        }]
    })
    .then(appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Aucune appointment trouvée !'});
        }
        res.status(200).json(appointment);
    })
};