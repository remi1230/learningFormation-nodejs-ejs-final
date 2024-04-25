
# Créer d'un web service pour location de véhicules Node.js et MongoDB
## Installation
### GIT
#### Depuis un Shell de votre OS avec Node.js d'installé:
```bash
git init https://github.com/remi1230/learningFormation-nodejs-ejs-final.git
git pull
```

### NPM
#### Depuis le repertoire du projet:
```bash
npm install
```

## Contexte

Dans le cadre du développement de solutions de mobilité adaptées aux besoins actuels, votre mission est de créer un web service back-end permettant la mise en relation entre les prestataires de location de véhicules et les potentiels locataires. Ce service facilitera la consultation et la demande de location de véhicules, organisés par catégories.
Votre Rôle

En tant que développeur back-end, vous travaillez pour une entreprise innovante dans le secteur de la mobilité. Vous êtes chargé de concevoir et de mettre en œuvre un web service utilisant Node.js et MongoDB. Ce service permettra aux prestataires de lister leurs véhicules disponibles et aux locataires de naviguer parmi ces offres et de formuler des demandes de location.

## Spécifications fonctionnelles :

### Interface prestataire (API) :

    Inscription/Connexion sécurisée.
    Ajout, modification, et suppression de véhicules à louer.
    Classification des véhicules par catégories (ex. : voiture, moto, vélo). 

### Interface locataire (API) :

    Inscription/Connexion sécurisée.
    Consultation des véhicules disponibles, organisés par catégories.
    Consultation des détails d'un véhicule et ajout des commentaires 
    Demande de location 

### Fonctionnalités Backend :

    Gestion sécurisée des utilisateurs et des sessions via JWT (JSON Web Tokens).
    Interface administrateur pour la supervision des utilisateurs et des annonces.
    Notifications pour les demandes de location et les mises à jour des statuts.

### Contraintes :

    Utilisation obligatoire de Node.js pour le backend et MongoDB pour la base de données.
    Authentification et gestion des sessions via JWT.
    Le service doit être conçu pour être testé avec Insomnia ou Postman (sans interface front-end).
    Veiller à la sécurité des données utilisateurs.

### Livrables :

    Rapport de conception détaillant l'architecture du système, choix technologiques, modèles de données, et API endpoints.
    Code source du projet avec instructions pour l'installation et le déploiement.
    Documentation API expliquant comment utiliser les différents endpoints.
    Captures d'écran de Trello montrant l'organisation du projet et la gestion des tâches.

### Évaluation
    Votre projet sera évalué sur la qualité et la clarté du code, la pertinence et l'efficacité des fonctionnalités API, l'organisation du projet (illustrée par Trello), et la sécurité de l'application.
