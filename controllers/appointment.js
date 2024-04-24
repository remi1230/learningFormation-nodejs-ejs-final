//Importation du modèle représentant la structure des données en BDD pour les tables appointment, user et service
const db          = require('../model');
const Appointment = db.Appointment;
const Service     = db.Service;
const User        = db.User;

const { createUser }          = require('./user');
const { takeAppointmentPage } = require('./main');
const { getAllAppointments }  = require('../services/backoffice');
const { dateToStrFr }         = require('../services/backoffice');
const { sendMail }            = require('../services/mail');

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
        const date      = req.body.date;
        const time      = req.body.time;
        const status    = 'pending';

        await Appointment.create({
            userId    : user.id,
            serviceId : serviceId,
            date      : date,
            time      : time,
            status    : status
        });
        //res.status(201).json({message: 'Appointment enregistré !'});
        takeAppointmentPage(req, res, next);
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

    const id            = req.params.id;
    const status        = req.body.status;
    const statusForMail = status === 'approved' ? 'accepté' : (status === 'declined' ? 'décliné' : 'en attente');

    Appointment.findByPk(id, {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName']
            },
            {
                model: Service,
                attributes: ['id', 'name']
            }
        ]
    })
    .then(async appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Appointment non trouvé !'});
        }
        const updateValues = {
            status: status !== undefined ? status : appointment.status,
        };

        const userFullName = appointment.User.fullName; 
        const serviceRDV   = appointment.Service.name;
        const dateRDV      = dateToStrFr(appointment.date);
        const timeRDV      = appointment.time.slice(0, 5);
        
        await appointment.update(updateValues)
        .then(() => 
            {   sendMail({
                    from    : 'remitafforeau@gmail.com',
                    to      : 'remitafforeau@yahoo.fr',
                    subject : 'RDV ' + statusForMail,
                    text    : `Bonjour ${ userFullName }, nous vous informons que votre RDV du ${ dateRDV } à ${ timeRDV } avec le service ${ serviceRDV } est ${ statusForMail }`
                });
                return res.status(200).json({message: 'Appointment mis à jour !'});
            }
        )
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({erreur: error, id: id}));
};

 /**
 * Récupère toutes les appointment
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAll = async (req, res, next) => {
    try {
        const appointments  = await getAllAppointments(req);

        if (!appointments) {
            return res.status(404).json({error: 'Aucun RDV trouvé !'});
        }
        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue");
    }
};

 /**
 * Récupère toutes les appointment d'un patient
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getByService = (req, res, next) => {
    Appointment.findAll({
        where: { serviceId: req.params.serviceId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            },
            {
                model: Service,
                attributes: ['id', 'name', 'description']
            }
        ]
    })
    .then(appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Aucun appointment trouvée !'});
        }
        res.status(200).json(appointment);
    })
};

 /**
 * Récupère toutes les appointment d'un patient
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getByPatient = (req, res, next) => {
    Appointment.findAll({
        where: { userId: req.params.patientId },
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            },
            {
                model: Service,
                attributes: ['id', 'name', 'description']
            }
        ]
    })
    .then(appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Aucun appointment trouvée !'});
        }
        res.status(200).json(appointment);
    })
};

 /**
 * Récupère un RDV par ID
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getById = (req, res, next) => {
    Appointment.findByPk(req.params.id, {
        include: [
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
            },
            {
                model: Service,
                attributes: ['id', 'name', 'description']
            }
        ]
    })
    .then(appointment => {
        if (!appointment) {
            return res.status(404).json({error: 'Aucun appointment trouvée !'});
        }
        res.status(200).json(appointment);
    })
};