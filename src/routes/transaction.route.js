const transactionController = require('../controllers/transaction.controller');
const express = require('express');
const router = express.Router();

router.post('/create', transactionController.createTransaction);
router.post('/pay/:transaction_id', transactionController.payTransaction);
router.delete('/:id', transactionController.deleteTransaction);
router.get('', transactionController.getTransactions);

module.exports = router;