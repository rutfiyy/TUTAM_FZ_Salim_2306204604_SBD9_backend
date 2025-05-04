const itemRepository = require('../repositories/item.repository');
const cloudinary = require('cloudinary').v2;
const baseResponse = require('../utils/baseResponse.util');
const streamifier = require('streamifier');

exports.createItem = async (req, res) => {
    if (!req.body.name) {
        return baseResponse(res, false, 400, 'Missing item name', null);
    }
    if (!req.body.price) {
        return baseResponse(res, false, 400, 'Missing item price', null);
    }
    let regex = /^[0-9]+$/;
    if (!regex.test(req.body.price)) {
        return baseResponse(res, false, 400, 'Price must be a number', null);
    }
    if (req.body.price <= 0) {
        return baseResponse(res, false, 400, 'Price must be larger than 0', null);
    }
    if (!req.body.stock) {
        return baseResponse(res, false, 400, 'Missing stock', null);
    }
    if (!req.body.store_id) {
        return baseResponse(res, false, 400, 'Missing store_id', null);
    }
    if (!req.file) {
        return baseResponse(res, false, 400, 'Missing image', null);
    }
    let imageUrl;
    try {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return baseResponse(res, false, 500, 'Error uploading image', error);
            }
            imageUrl = result.secure_url;
            createItemInRepository();
        });

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
        return baseResponse(res, false, 500, 'Error uploading image', error);
    }

    const createItemInRepository = async () => {
        if (!req.body.stock) {
            return baseResponse(res, false, 400, 'Missing stock', null);
        }
        try {
            const item = await itemRepository.createItem({
                name: req.body.name,
                price: req.body.price,
                store_id: req.body.store_id,
                image: imageUrl,
                stock: req.body.stock
            });
            if (!item) {
                return baseResponse(res, false, 404, 'Store doesnt exist', null);
            }
            baseResponse(res, true, 201, 'Item created', item);
        } catch (error) {
            baseResponse(res, false, 500, error.message || 'Server error', error);
        }
    };
}

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        if (items.length === 0) {
            return baseResponse(res, false, 404, 'No items found', null);
        }
        baseResponse(res, true, 200, 'Items found', items);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving items', error);
    }
}

exports.getItemById = async (req, res) => {
    try {
        if (!req.params.id) {
            return baseResponse(res, false, 400, 'Missing item id', null);
        }
        const item = await itemRepository.getItemById(req.params.id);
        if (!item) {
            return baseResponse(res, false, 404, 'Item not found', null);
        }
        baseResponse(res, true, 200, 'Item found', item);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving item', error);
    }
}

exports.getItemsByStore = async (req, res) => {
    try {
        if (!req.params.store_id) {
            return baseResponse(res, false, 400, 'Missing store_id', null);
        }
        const items = await itemRepository.getItemsByStore(req.params.store_id);
        if (items.length === 0) {
            return baseResponse(res, false, 404, 'Store doesnt exist', null);
        }
        baseResponse(res, true, 200, 'Items found', items);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving items', error);
    }
}

exports.updateItem = async (req, res) => {
    if (!req.body.name) {
        return baseResponse(res, false, 400, 'Missing item name', null);
    }
    if (!req.body.price) {
        return baseResponse(res, false, 400, 'Missing item price', null);
    }
    let regex = /^[0-9]+$/;
    if (!regex.test(req.body.price)) {
        return baseResponse(res, false, 400, 'Price must be a number', null);
    }
    if (req.body.price <= 0) {
        return baseResponse(res, false, 400, 'Price must be larger than 0', null);
    }
    if (!req.body.store_id) {
        return baseResponse(res, false, 400, 'Missing store_id', null);
    }
    if (!req.file) {
        return baseResponse(res, false, 400, 'Missing image', null);
    }
    let imageUrl;
    try {
        const uploadStream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
            if (error) {
                return baseResponse(res, false, 500, 'Error uploading image', error);
            }
            imageUrl = result.secure_url;
            updateItemInRepository();
        });

        streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
        return baseResponse(res, false, 500, 'Error uploading image', error);
    }
    
    if (!req.body.stock) {
        return baseResponse(res, false, 400, 'Missing stock', null);
    }
    if (!req.body.id) {
        return baseResponse(res, false, 400, 'Missing item id', null);
    }

    const updateItemInRepository = async () => {
        try {
            const item = await itemRepository.updateItem({
                name: req.body.name,
                price: req.body.price,
                store_id: req.body.store_id,
                image: imageUrl,
                stock: req.body.stock,
                id: req.body.id
            });
            if (!item) {
                return baseResponse(res, false, 404, 'Store doesnt exist', null);
            }
            baseResponse(res, true, 200, 'Item updated', item);
        } catch (error) {
            baseResponse(res, false, 500, 'Error updating item', error);
        }
    };
}

exports.deleteItem = async (req, res) => {
    try {
        if (!req.params.id) {
            return baseResponse(res, false, 400, 'Missing item id', null);
        }
        const item = await itemRepository.deleteItem(req.params.id);
        if (!item) {
            return baseResponse(res, false, 404, 'Item not found', null);
        }
        baseResponse(res, true, 200, 'Item deleted', item);
    } catch (error) {
        baseResponse(res, false, 500, 'Error deleting item', error);
    }
}