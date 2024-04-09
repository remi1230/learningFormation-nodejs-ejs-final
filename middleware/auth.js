const jwt = require('jsonwebtoken');

/**
 * Middleware d'authentification pour vérifier les tokens JWT.
 * Ce middleware extrait le token JWT de l'en-tête d'autorisation de la requête entrante, le vérifie,
 * puis extrait et stocke l'ID de l'utilisateur et son rôle dans `req.auth` pour utilisation dans les middlewares suivants.
 * 
 * Si la vérification du token échoue, une réponse avec le statut 401 (Non autorisé) est envoyée.
 * 
 * @param {Object} req - L'objet de la requête Express. L'en-tête Authorization doit contenir le token JWT.
 * @param {Object} res - L'objet de la réponse Express.
 * @param {Function} next - La fonction middleware suivante dans le cycle de vie de la requête.
 */
module.exports = (req, res, next) => {
    try {
        // Extraction du token JWT de l'en-tête cookie
        // Extraction du cookie
        const cookieHeader = req.headers.cookie || '';
        // Découpage du cookie pour trouver le token
        const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
            const [key, value] = cookie.split('=').map(part => part.trim());
            acc[key] = value;
            return acc;
        }, {});
        
        // Vérification de l'existence du token dans les cookies
        if (!cookies.token) {
            throw 'Token manquant dans les cookies';
        }
        
        // Utilisation du token présent dans le cookie
        const token = cookies.token;
        // Vérification du token à l'aide de la clé secrète
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // Extraction de l'ID de l'utilisateur et de son rôle du token décodé
        const userId   = decodedToken.userId;
        const userRole = decodedToken.userRole;

        // Ajout des informations d'authentification à l'objet de la requête
        req.auth = {
            userId: userId,
            userRole: userRole
        };
        next(); // Passage au middleware suivant
    } catch(error) {
        // En cas d'échec de la vérification du token, envoie une réponse d'erreur
        res.status(401).json({ error });
    }
};