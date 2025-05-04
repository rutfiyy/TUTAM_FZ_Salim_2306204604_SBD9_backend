const db = require('../database/pg.database');

exports.getAllCards = async () => {
    try {
        const result = await db.query('SELECT * FROM cards');
        return result.rows;
    } catch (error) {
        console.error('Error retrieving cards:', error);
        throw error;
    }
};

exports.createCard = async (card) => {
    const { name, cost, description } = card;
    try {
        const result = await db.query(
            'INSERT INTO cards (name, cost, description) VALUES ($1, $2, $3) RETURNING *',
            [name, cost, description]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error creating card:', error);
        throw error;
    }
};

exports.updateCard = async (card) => {
    const { id, name, cost, description } = card;
    try {
        const result = await db.query(
            'UPDATE cards SET name = $1, cost = $2, description = $3 WHERE id = $4 RETURNING *',
            [name, cost, description, id]
        );
        return result.rows[0];
    } catch (error) {
        console.error('Error updating card:', error);
        throw error;
    }
};

exports.deleteCard = async (id) => {
    try {
        const result = await db.query('DELETE FROM cards WHERE id = $1 RETURNING *', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error deleting card:', error);
        throw error;
    }
};