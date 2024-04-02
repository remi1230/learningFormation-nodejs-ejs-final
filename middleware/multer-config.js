const multer = require('multer');

// Définition des types MIME pour la correspondance avec les extensions de fichier
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

/**
 * Configuration du stockage pour Multer.
 * Spécifie le répertoire de destination pour les fichiers téléchargés et la logique de nommage des fichiers.
 * 
 * Le répertoire de destination est défini sur 'images'.
 * Le nom de fichier est généré à partir du nom original du fichier, en remplaçant les espaces par des underscores,
 * et en ajoutant un timestamp pour rendre le nom unique, suivi de l'extension appropriée basée sur le type MIME du fichier.
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Spécifie le dossier de destination des fichiers téléchargés
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    // Génère le nom de fichier
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    // Ajoute un timestamp au nom de fichier pour éviter les conflits de noms
    callback(null, name + Date.now() + '.' + extension);
  }
});

// Exporte le middleware configuré pour gérer le téléchargement de fichiers,
// autorisant uniquement le téléchargement d'un fichier à la fois avec le champ 'image'.
module.exports = multer({storage: storage}).single('image');