# ECV - Javascript, NodeJS et Asynchrone

Arthur HAMEL - M2 DEV

https://hackmd.io/@dws-teach/Bk2CorkV_

## Description du répertoire

- `/public` : Dossier contenant tous les fichiers publiques (back-office de l'API)
- `/src/controllers` : Dossier contenant les contrôlleurs par thématique où est implémentée la logique métier
- `/src/database` : Dossier contenant le fichier de configuration de la base de données et le seeder permettant de créer des utilisateurs / posts / likes / comments
- `/src/helpers` : Dossier contenant les fichiers d'aides => request / response
- `/src/lib` : Dossier contenant les fichiers le configuration de certaines libraires / modules => passport
- `/src/mandatories` : Dossier contenant les règles associées aux traitements des données entrantes
- `/src/models` : Dossier contenant les modèles de données
- `/src/routes` : Dossier contenant les routes par thématique

## Installation et lancement (sans docker)

Lancer MongoDB

```bash
mongod
```

Installer les dépendances

```bash
npm i
```

Installer globalement nodemon pour le rechargement à chaud

```bash
sudo npm i -g nodemon
```

Créer un fichier .env à partir du fichier .env.dist

```bash
cp .env.dist .env
```

Remplir la base de données

```bash
npm run seed
```

Lancer l'application en mode développement

```bash
npm run dev
```

## Installation et lancement (docker-compose)

Prérequis:

- Docker
- docker-compose

Construction / téléchargement des images et lancement des containers

```bash
bash start.sh
```
