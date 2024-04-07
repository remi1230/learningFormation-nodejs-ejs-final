
// Importation des modèles représentant la structure des données en BDD pour la table user
const db   = require('../model');
const User = db.User;

const { getAllServices, getAllSchedules, getAllNews } = require('../services/backoffice');

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
            console.log(user)
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

                    const services  = await getAllServices(req);
                    const schedules = await getAllSchedules(req);
                    const news      = await getAllNews(req);

                    services.sort((a, b) => { return a.name.localeCompare(b.name); });

                    res.cookie('token', token, { httpOnly: false, maxAge: 24 * 60 * 60 * 1000 });
                    res.render('backOffice', { user, services, schedules, news });
                })
                .catch(error => res.status(500).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
 };