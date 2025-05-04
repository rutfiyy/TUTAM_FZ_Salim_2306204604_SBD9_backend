const db = require('./../database/pg.database');

exports.createItem = async (item) => {
    try {
        const result = await db.query('INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *', [item.name, item.price, item.store_id, item.image, item.stock]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.getAllItems = async () => {
    try {
        const items = await db.query('SELECT * FROM items');
        return items.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.getItemById = async (id) => {
    try {
        const item = await db.query('SELECT * FROM items WHERE id = $1', [id]);
        return item.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.getItemsByStore = async (store_id) => {
    try {
        const items = await db.query('SELECT * FROM items WHERE store_id = $1', [store_id]);
        return items.rows;
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.updateItem = async (item) => {
    try {
       const result = await db.query('UPDATE items SET name = $1, price = $2, image_url = $3, stock = $4, store_id = $5 WHERE id = $6 RETURNING *', [item.name, item.price, item.image, item.stock, item.store_id, item.id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}

exports.deleteItem = async (id) => {
    try {
        const result = await db.query('SELECT * FROM items WHERE id = $1', [id]);
        await db.query('DELETE FROM items WHERE id = $1', [id]);
        return result.rows[0];
    } catch (error) {
        console.error('Error executing query', error);
    }
}