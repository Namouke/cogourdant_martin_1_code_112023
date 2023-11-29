const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création d'un schéma utilisateur pour s'assurer que chaque email est unique
const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},
    { timestamps: true });

// Utilisation du plugin mongoose-unique-validator pour éviter la création de plusieurs comptes avec la même adresse email
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);