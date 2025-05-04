const transactionRepository = require('../repositories/transaction.repository');
const baseResponse = require('../utils/baseResponse.util');

exports.createTransaction = async (req, res) => {
    try {
        if (!req.body.user_id || !req.body.item_id) {
            return baseResponse(res, false, 400, 'Missing user_id or item_id', null);
        }
        if (req.body.quantity <= 0 || !req.body.quantity) {
            return baseResponse(res, false, 400, 'Quantity must be larger than 0', null);
        }
        const transaction = await transactionRepository.createTransaction(req.body);
        if (!transaction) {
            return baseResponse(res, false, 404, 'Transaction not created', null);
        }
        baseResponse(res, true, 201, 'Transaction created', transaction);
    } catch (error) {
        baseResponse(res, false, 500, 'Error creating transaction', error);
    }
}

exports.payTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.payTransaction(req.params.transaction_id);
        if (!transaction) {
            return baseResponse(res, false, 404, 'Failed to pay', null);
        }
        baseResponse(res, true, 200, 'Transaction paid', transaction);
    } catch (error) {
        baseResponse(res, false, 500, 'Error paying transaction', error);
    }
}

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await transactionRepository.deleteTransaction(req.params.id);
        if (!transaction) {
            return baseResponse(res, false, 404, 'Transaction not found', null);
        }
        baseResponse(res, true, 200, 'Transaction deleted', transaction);
    } catch (error) {
        baseResponse(res, false, 500, 'Error deleting transaction', error);
    }
}

exports.getTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getTransactions();
        if (!transactions) {
            return baseResponse(res, false, 404, 'Transactions not found', null);
        }
        baseResponse(res, true, 200, 'Transactions found', transactions);
    } catch (error) {
        baseResponse(res, false, 500, 'Error getting transactions', error);
    }
}