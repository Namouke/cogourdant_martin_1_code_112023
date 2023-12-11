// Importation des modules nécessaires
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Masquer les informations de la base de données
dotenv.config();

// Importation des routes 
const userRoutes = require('./routes/User');
const sauceRoutes = require('./routes/Sauce');

const app = express();

// Connexion à la base de données MongoDB 
mongoose.connect(`mongodb+srv://${process.env.mongodb_login}:${process.env.mongodb_password}@go-fullstack.iwl5che.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(express.json());

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use((req, res) => {
    res.json({ message: `Votre message a bien été reçu !` });
});

// Exportation de "app" pour l'utiliser dans d'autres fichiers
module.exports = app; 