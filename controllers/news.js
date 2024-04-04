//Importation du modèle représentant la structure des données en BDD pour les tables news et user
const db      = require('../model');
const News = db.News;
const User = db.User;

/**
 * Crée un nouveau news avec le nom et la description fourni dans le corps de la requête.
 * Sauvegarde le nouveau news dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête Express. `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de création réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.add = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json( { error: "You must be a professional to add a news!" })};

    const title         = req.body.title;
    const content       = req.body.content;
    const authorId      = req.auth.userId;
    const publishedDate = new Date();
    News.create({
        userId        : authorId,
        title         : title,
        content       : content,
        obsolete      : false,
        publishedDate : publishedDate
    })
    .then(() => { res.status(201).json({message: 'News enregistré !'})})
    .catch(error => { res.status(400).json( { error })})
 };

 /**
 * Met à jour un news existant avec le nom et la description fournis dans le corps de la requête.
 * Recherche le news par son ID fourni en paramètre de la requête et met à jour ses informations.
 * 
 * @param {Object} req - L'objet de la requête Express. `params` doit contenir `id`, et `body` doit contenir `name` et `description`.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.update = (req, res, next) => {
    if(req.auth.userRole !== 'Professional'){ return res.status(400).json({ error: "Seuls les professionnels peuvent modifier les news!" })};

    const id          = req.params.id;
    const title       = req.body.title;
    const content     = req.body.content;
    const obsolete    = req.body.obsolete;
    const newAuthorId = req.auth.userId;

    News.findByPk(id)
    .then(news => {
        if (!news) {
            return res.status(404).json({error: 'News non trouvé !'});
        }

        if(newAuthorId !== news.userId){
            return res.status(401).json({ message: "Vous devez être l'auteur de la news pour la modifier" });
        }

        const updateValues = {
            title    : title   !== undefined ? title   : news.title,
            content  : content !== undefined ? content : news.content,
            obsolete : obsolete !== undefined ? obsolete : news.obsolete,
        };
        
        news.update(updateValues)
        .then(() => res.status(200).json({message: 'News mis à jour !'}))
        .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(400).json({error}));
};

 /**
 * Récupère toutes les news
 * 
 * @param {Object} req - L'objet de la requête Express.
 * @param {Object} res - L'objet de la réponse Express. Renvoie un message de succès en cas de mise à jour réussie.
 * @param {Function} next - La fonction middleware à exécuter ensuite.
 */
exports.getAll = (req, res, next) => {
    News.findAll({
        where: { obsolete: 0 },
        include: [{
            model: User,
            attributes: ['id', 'firstName', 'lastName', 'email', 'phoneNumber']
        }]
    })
    .then(news => {
        if (!news) {
            return res.status(404).json({error: 'Aucune news trouvée !'});
        }
        res.status(200).json(news);
    })
};