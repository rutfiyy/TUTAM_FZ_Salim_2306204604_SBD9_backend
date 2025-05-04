const cardRepository = require('../repositories/card.repository');
const cloudinary = require('cloudinary').v2;
const baseResponse = require('../utils/baseResponse.util');
const streamifier = require('streamifier');

exports.getAllCards = async (req, res) => {
    try {
        const cards = await cardRepository.getAllCards();
        return baseResponse(res, true, 200, 'Cards retrieved successfully', cards);
    } catch (error) {
        console.error('Error retrieving cards:', error);
        return baseResponse(res, false, 500, 'Error retrieving cards', error.message);
    }
};

exports.createCard = async (req, res) => {
    const { name, cost, description } = req.body;

    if (!name) {
        return baseResponse(res, false, 400, 'Missing card name', null);
    }
    if (!cost) {
        return baseResponse(res, false, 400, 'Missing card cost', null);
    }
    if (!description) {
        return baseResponse(res, false, 400, 'Missing card description', null);
    }

    try {
        // Create the card in the database
        const card = await cardRepository.createCard({
            name,
            cost,
            description
        });

        return baseResponse(res, true, 201, 'Card created successfully', card);
    } catch (error) {
        console.error('Error creating card:', error);
        return baseResponse(res, false, 500, 'Error creating card', error.message);
    }
};

exports.updateCard = async (req, res) => {
    const { id, name, cost, description } = req.body; // Extract `id` from the request body

    console.log("Received update request for card ID:", id); // Debugging the ID
    console.log("Received card data:", { name, cost, description }); // Debugging the card data

    if (!id) {
        return baseResponse(res, false, 400, 'Missing card ID', null);
    }
    if (!name) {
        return baseResponse(res, false, 400, 'Missing card name', null);
    }
    if (!cost) {
        return baseResponse(res, false, 400, 'Missing card cost', null);
    }
    if (!description) {
        return baseResponse(res, false, 400, 'Missing card description', null);
    }

    try {
        const card = await cardRepository.updateCard({ id, name, cost, description });
        if (!card) {
            return baseResponse(res, false, 404, "Card not found", null);
        }
        baseResponse(res, true, 200, "Card updated successfully", card);
    } catch (error) {
        console.error("Error updating card:", error);
        baseResponse(res, false, 500, "Error updating card", error.message);
    }
};

exports.deleteCard = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return baseResponse(res, false, 400, 'Missing card ID', null);
    }

    try {
        const card = await cardRepository.deleteCard(id);
        if (!card) {
            return baseResponse(res, false, 404, 'Card not found', null);
        }
        baseResponse(res, true, 200, 'Card deleted successfully', card);
    } catch (error) {
        baseResponse(res, false, 500, 'Error deleting card', error.message);
    }
};