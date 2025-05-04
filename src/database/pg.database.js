require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
    ssl: {
        rejectUnauthorized: false
    },
});

const query = async (query, values) => {
    let client;
    try {
        client = await pool.connect();
        const result = await client.query(query, values);
        return result;
    } catch (error) {
        console.error('Database query error', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
}

const transaction = async (queries) => {
    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN'); // Start transaction

        const results = [];
        for (const { query, values } of queries) {
            const result = await client.query(query, values);
            results.push(result);
        }

        await client.query('COMMIT'); // Commit transaction
        return results;
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK'); // Rollback transaction on error
        }
        console.error('Transaction error', error);
        throw error;
    } finally {
        if (client) {
            client.release();
        }
    }
};

module.exports = {
    pool,
    query,
    transaction
};