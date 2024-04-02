
// Importation des modèles représentant la structure des données en BDD pour la table user
const db   = require('../model');
const User = db.User;

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
                service     : req.body.service && req.body.service._id ? req.body.service._id : null,
                obsolete    : false,
            })
            .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
            .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
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
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id,
                              userRole: user.role,
                            },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };