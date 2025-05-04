const storeRepository = require('./../repositories/store.repository');
const baseResponse = require('./../utils/baseResponse.util');

exports.getAllStores = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        if (stores.length === 0) {
            return baseResponse(res, false, 404, 'No stores found', null);
        }
        baseResponse(res, true, 200, 'Stores found', stores);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving stores', error);
    }
}

exports.createStore = async (req, res) => {
    if (!req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, 'Missing store name or address', null);
    }
    try {
        const store = await storeRepository.createStore
        ({ name: req.body.name, address: req.body.address });
        baseResponse(res, true, 201, 'Store created', store);
    } catch (error) {
        baseResponse(res, false, 500, error.message || 'Server error', error);
    }
}

exports.getStoreById = async (req, res) => {
    try {
        if (!req.params.id) {
            return baseResponse(res, false, 400, 'Missing store id', null);
        }
        const store = await storeRepository.getStoreById(req.params.id);
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }
        baseResponse(res, true, 200, 'Store found', store);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving store', error);
    }
}

exports.updateStore = async (req, res) => {
    if (!req.body.id || !req.body.name || !req.body.address) {
        return baseResponse(res, false, 400, 'Missing store id, name or address');
    }
    try {
        const store = await storeRepository.updateStore
            ({ id: req.body.id, name: req.body.name, address: req.body.address });
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }
        baseResponse(res, true, 200, 'Store updated', store);
    }
    catch (error) {
        baseResponse(res, false, 500, 'Error updating store', error);
    }
}

exports.deleteStore = async (req, res) => {
    try {
        if (!req.params.id) {
            return baseResponse(res, false, 400, 'Missing store id', null);
        }
        const store = await storeRepository.deleteStore(req.params.id);
        if (!store) {
            return baseResponse(res, false, 404, 'Store not found', null);
        }
        baseResponse(res, true, 200, 'Store deleted', store);
    } catch (error) {
        baseResponse(res, false, 500, 'Error deleting store', error);
    }
}