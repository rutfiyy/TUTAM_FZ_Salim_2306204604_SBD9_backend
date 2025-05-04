const express = require('express');
const cardController = require('../controllers/card.controller');

const router = express.Router();

router.get('/', cardController.getAllCards);
router.post('/', cardController.createCard);
router.put('/update', cardController.updateCard);
router.delete('/:id', cardController.deleteCard);

module.exports = router;