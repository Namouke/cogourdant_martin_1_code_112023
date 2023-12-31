const Sauce = require('../models/Sauce');
const fs = require('fs');

// Middleware de récupération de toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => {
            res.status(200).json(sauces)
        })
        .catch(error => res.status(500).json({ error }));
};

// Middleware de récupération d'une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }))
};

// Middleware de création d'une sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => {
            res.status(201).json({ message: 'Objet enregistré !' })
        })
        .catch(error => { res.status(400).json({ error }) });
};

// Middleware de suppression d'une sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: 'non autorisé' })
            }
            else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => {
                            res.status(200).json({ message: 'Objet supprimé' })
                        })
                        .catch(error => res.status(401).json({ error }))
                })
            }
        })
        .catch(error => {
            res.status(500).json({ error });
        })
};

// Middleware de modification d'une sauce
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    delete sauceObject.userId;
    delete sauceObject.like;
    delete sauceObject.dislikes;
    delete sauceObject.usersLiked;
    delete sauceObject.usersDisliked;
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(403).json({ message: 'unauthorized request' });
            }
            else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'tout est ok' }))
                    .catch(error => { res.status(401).json({ error }) });
            }
        })
        .catch(error => {
            res.status(400).json({ error })
        })
};

// Middleware de la fonctionnalité like ou dislike d'une sauce
exports.likeSauce = (req, res, next) => {
    // Recherche de la sauce par son identifiant dans la base de données
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {

            // Récupération des données de la requête
            let like = req.body.like; // Valeur du like (-1 pour dislike, 0 pour annuler, 1 pour like)
            let userId = req.auth.userId; // Identifiant de l'utilisateur effectuant l'action de like, dislike ou pour retirer son vote
            let likesIndex = -1; // Index de l'utilisateur dans le tableau des likes
            let dislikesIndex = -1; // Index de l'utilisateur dans le tableau des dislikes

            // Boucle For in pour parcourir le tableau des utilisateurs ayant aimé la sauce
            for (let i in sauce.usersLiked) {
                const user = sauce.usersLiked[i];
                if (user == userId) {
                    likesIndex = i;
                }
            }

            // Gestion des likes
            if (like == 1 && likesIndex == -1) {
                sauce.usersLiked.push(userId)
            }
            if (like == 0 && likesIndex != -1) {
                sauce.usersLiked.splice(likesIndex, 1)
            }

            // Mise à jour du nombre total de likes
            sauce.likes = sauce.usersLiked.length;

            // Boucle For in pour parcourir le tableau des utilisateurs n'ayant pas aimé la sauce
            for (let i in sauce.usersDisliked) {
                const user = sauce.usersDisliked[i];
                if (user == userId) {
                    dislikesIndex = i;
                }
            }

            // Gestion des dislikes
            if (like == -1 && dislikesIndex == -1) {
                sauce.usersDisliked.push(userId)
            }
            if (like == 0 && dislikesIndex != -1) {
                sauce.usersDisliked.splice(dislikesIndex, 1)
            }

            // Mise à jour du nombre total de dislikes
            sauce.dislikes = sauce.usersDisliked.length;

            // Sauvegarde des modifications dans la base de données
            return sauce.save()
                .then(() => {
                    console.log(sauce);
                    res.status(200).json({ message: 'Likes mis à jour' })
                });
        })
        .catch(error => ({ error }));
}


