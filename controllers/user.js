
// Importation des modèles représentant la structure des données en BDD pour les tables user et service
const db   = require('../model');
const User    = db.User;
const Service = db.Service;

const { getAllServices, getAllSchedules, getAllSchedulesNotInBase, getAllNews, getAllAppointments, getAllPatients, getAllProfessionals } = require('../services/backoffice');

// Importation des modules `bcrypt` et `jsonwebtoken`.
// `bcrypt` est utilisé pour le hachage sécurisé des mots de passe.
// `jsonwebtoken` sert à créer et à vérifier les tokens JWT (JSON Web Tokens).
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

/**
 * Crée un nouvel utilisateur dans la base de données.
 * Hash le mot de passe fourni avant de sauvegarder l'utilisateur pour assurer la sécurité des données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` contient `pseudo`, `email`, `password`, et `role` de l'utilisateur.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            User.create({
                firstName   : req.body.firstname,
                lastName    : req.body.lastname,
                email       : req.body.email,
                phoneNumber : req.body.phoneNumber,
                password    : hash,
                role        : req.body.role,
                service     : req.body.serviceId ? req.body.serviceId : null,
                obsolete    : false,
            })
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

/**
 * Crée un nouvel utilisateur dans la base de données.
 * Hash le mot de passe fourni avant de sauvegarder l'utilisateur pour assurer la sécurité des données.
 * 
 * @param {Object} userData - Données utilisateur
 */
exports.createUser = (userData) => {
    return bcrypt.hash(userData.password, 10)
        .then(hash => {
            return User.create({
                firstName   : userData.firstName,
                lastName    : userData.lastName,
                email       : userData.email,
                phoneNumber : userData.phoneNumber,
                password    : hash,
                role        : userData.role,
                service     : userData.service && userData.serviceId ? userData.serviceId : null,
                obsolete    : false,
            });
        });
};

/**
 * Authentifie un utilisateur.
 * Vérifie si l'utilisateur existe avec l'email fourni, puis compare le mot de passe fourni avec le hash stocké.
 * En cas de succès, renvoie l'ID de l'utilisateur et un token JWT.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `email` et `password` de l'utilisateur.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.login = (req, res, next) => {
    User.findOne({where: { email: req.body.email }})
        .then(user => {
            if (!user) {
                res.render('wrongPassword');
            }
            else if(user.role !== 'Professional'){ res.render('patientNoConnexion'); }
            else{
                bcrypt.compare(req.body.password, user.password)
                .then(async valid => {
                    if (!valid) {
                        res.render('wrongPassword');
                    }

                    const token = jwt.sign(
                        { userId: user.id,
                          userRole: user.role,
                        },
                        'RANDOM_TOKEN_SECRET',
                        { expiresIn: '24h' }
                    );

                    const services      = await getAllServices(req);
                    const servicesPro   = await getAllServices(req, false);
                    const schedules     = await getAllSchedules(req);
                    const news          = await getAllNews(req);
                    const appointments  = await getAllAppointments(req);
                    const patients      = await getAllPatients(req);
                    const professionals = await getAllProfessionals(req);

                    const schedulesNotInBase = await getAllSchedulesNotInBase();

                    const toUpd = true;

                    services.sort((a, b) => { return a.name.localeCompare(b.name); });

                    res.cookie('token', token, { httpOnly: false, maxAge: 24 * 60 * 60 * 1000 });
                    res.render('backOffice', { user, services, servicesPro, schedules, schedulesNotInBase, news, appointments, patients, professionals, toUpd });
                })
                .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
 };

 /**
 * Récupère un patient
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getPatientById = (req, res, next) => {
    User.findByPk(req.params.id, {where: { role: 'Patient' }})
    .then(user => {
        if (!user) {
            return res.status(404).json({error: 'Patient non trouvé !'});
        }
        return res.status(200).json({user});
    })
    .catch(error => res.status(400).json({error}));
};

 /**
 * Récupère un professionnel
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getProfessionalById = (req, res, next) => {
    User.findByPk(req.params.id, {
        include: [
            {
                model: Service,
                attributes: ['id']
            }
        ],
        where: { role: 'Professional' }
    })
    .then(user => {
        if (!user) {
            return res.status(404).json({error: 'Collaborateur non trouvé !'});
        }
        return res.status(200).json({user});
    })
    .catch(error => res.status(400).json({error}));
};

/**
 * Récupère tous les professionnels et les retourne en JSON
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getProfessionals = async (req, res, next) => {
    try {
        const professionals  = await getAllProfessionals(req, false);

        return res.status(200).json({professionals});
    } catch (error) {
        console.error(error);
        res.status(500).send("Une erreur est survenue");
    }
};


/**
 * Crée un nouveau user avec le nom et la description fourni dans le corps de la requête.
 * Sauvegarde le nouveau user dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de création réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.addProfessional = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json( { error: "Vous devez faire partie de l'équipe pour ajouter un collaborateur !" })};

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const serviceId   = req.body.serviceId;
            const firstName   = req.body.firstName;
            const lastName    = req.body.lastName;
            const email       = req.body.email;
            const phoneNumber = req.body.phoneNumber;
            const role        = 'Professional';
            const obsolete    = false;
            User.create({
                serviceId   : serviceId,
                firstName   : firstName,
                lastName    : lastName,
                email       : email,
                password    : hash,
                phoneNumber : phoneNumber,
                role        : role,
                obsolete    : obsolete,
            })
            .then(() => res.status(201).json({ message: 'Collaborateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };

 /**
 * Met à jour un user existant avec le nom et la description fournis dans le corps de la requête.
 * Recherche le user par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `params` doit contenir `id`, et `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.updateProfessional = async (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "You must be a professional to update a user!" })};

    const id          = req.params.id;
    const service     = req.body.serviceId;
    const firstName   = req.body.firstName;
    const lastName    = req.body.lastName;
    const email       = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const obsolete    = req.body.obsolete;

    const hash = req.body.password ? await bcrypt.hash(req.body.password, 10) : false;

    User.findByPk(id)
    .then(user => {
        if (!user) {
            return res.status(404).json({error: 'User non trouvé !'});
        }

        // Mise à jour avec la vérification correcte pour 'obsolete'
        const updateValues = {
            serviceId   : service,
            firstName   : firstName,
            lastName    : lastName,
            email       : email,
            phoneNumber : phoneNumber,
        };

        if(hash){ updateValues.password = hash; }
        
        // Vérifie explicitement si 'obsolete' est présent dans le corps de la requête
        if (req.body.hasOwnProperty('obsolete')) {
            updateValues.obsolete = obsolete;
        }

        user.update(updateValues)
        .then(() => res.status(200).json({message: 'Collaborateur mis à jour !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
};