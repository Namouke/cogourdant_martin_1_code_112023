const mongoose = require('mongoose');

// Création d'un schéma de données pour les sauces
const sauceSchema = mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    manufacturer: { type: String, required: true },
    description: { type: String, required: true },
    mainPepper: { type: String, required: true },
    imageUrl: { type: String, required: true },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: Array },
    usersDisliked: { type: Array },
},
    { timestamps: true });


// On exporte le schéma en modèle utilisable
module.exports = mongoose.model('Sauce', sauceSchema);