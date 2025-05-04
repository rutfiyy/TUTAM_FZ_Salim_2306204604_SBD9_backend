const db = require('./../database/pg.database');
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports.register = async (user) => {
    try {
        user.password = await bcrypt.hash(user.password, saltRounds);
        const result = await db.query('INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *', [user.email, user.password, user.name]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.login = async (user) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [user.email]);
        if (result) {
            const match = await bcrypt.compare(user.password, result.rows[0].password);
            if (!match) {
                return null;
            }
        }
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.getUserByEmail = async (email) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.updateUser = async (user) => {
    try {
        const temp = await db.query('SELECT * FROM users WHERE id = $1', [user.id]);
        if (temp) {
            const match = await bcrypt.compare(user.password, temp.rows[0].password);
            user.password = await bcrypt.hash(user.password, saltRounds);
            if (match) {
                const result = await db.query('UPDATE users SET email = $1, password = $2, name = $3 WHERE id = $4 RETURNING *', [user.email, user.password, user.name, user.id]);
                return result.rows[0];
            } else {
                return null;
            }
        }
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.deleteUser = async (id) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
        await db.query('DELETE FROM users WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.topUpUser = async (user) => {
    try {
        const result = await db.query('UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *', [user.amount, user.id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}