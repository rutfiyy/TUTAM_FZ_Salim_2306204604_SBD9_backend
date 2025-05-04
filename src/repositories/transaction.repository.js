const baseResponse = require('../utils/baseResponse.util');
const db = require('./../database/pg.database');

exports.createTransaction = async (transaction) => {
    try {
        const item = await db.query('SELECT * FROM items WHERE id = $1', [transaction.item_id]);
        if (!item) {
            return null;
        }
        const total = item.rows[0].price * transaction.quantity;
        const result = await db.query('INSERT INTO transactions (user_id, item_id, quantity, total) VALUES ($1, $2, $3, $4) RETURNING *', [transaction.user_id, transaction.item_id, transaction.quantity, total]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.payTransaction = async (id) => {
    try {
        transaction = await db.query('SELECT * FROM transactions WHERE id = $1', [id]);
        user = await db.query('SELECT * FROM users WHERE id = $1', [transaction.rows[0].user_id]);
        item = await db.query('SELECT * FROM items WHERE id = $1', [transaction.rows[0].item_id]);
        if (!transaction || !user || !item) {
            //console.error('null');
            return null;
        }
        if (user.rows[0].balance < transaction.rows[0].total) {
            //console.error('balance');
            return null;
        }
        if (item.rows[0].stock < transaction.rows[0].quantity) {
            //console.error('stock');
            return null;
        }
        if (transaction.rows[0].status == 'paid') {
            //console.error('status');
            return null;
        }
        const result = await db.query('UPDATE transactions SET status = $1 WHERE id = $2 RETURNING *', ['paid', id]);
        if (!result) {
            //console.error('result');
            return null;
        }
        await db.query('UPDATE users SET balance = balance - $1 WHERE id = $2', [transaction.rows[0].total, transaction.rows[0].user_id]);
        await db.query('UPDATE items SET stock = stock - $1 WHERE id = $2', [transaction.rows[0].quantity, transaction.rows[0].item_id]);

        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.deleteTransaction = async (id) => {
    try {
        const result = await db.query('DELETE FROM transactions WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.getTransactions = async () => {
    try {
        const result = await db.query(`SELECT transactions.*, row_to_json(users) AS user, row_to_json(items) AS item FROM transactions INNER JOIN users ON transactions.user_id = users.id INNER JOIN items ON transactions.item_id = items.id`);
        return result.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}