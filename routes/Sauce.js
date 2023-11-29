
const express = require('express');
const auth = require('../middleware/authorize');
const multer = require('../middleware/multer-config');
const router = express.Router();

const sauceCtrl = require('../controllers/Sauce');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id', auth, sauceCtrl.modifySauce);

module.exports = router;