const userRepository = require('./../repositories/user.repository');
const baseResponse = require('./../utils/baseResponse.util');

exports.register = async (req, res) => {
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(req.query.email)) {
        return baseResponse(res, false, 400, 'Invalid email', null);
    }
    let regexPassword = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPassword.test(req.query.password)) {
        return baseResponse(res, false, 400, 'Password must contain at least 8 characters, 1 number, and 1 special character', null);
    }
    
    if (!req.query.email) {
        return baseResponse(res, false, 400, 'Missing email', null);
    }
    if (!req.query.password) {
        return baseResponse(res, false, 400, 'Missing password', null);
    }
    if (!req.query.name) {
        return baseResponse(res, false, 400, 'Missing name', null);
    }

    try {
        const user = await userRepository.register({ email: req.query.email, password: req.query.password, name: req.query.name });
        if (!user) {
            return baseResponse(res, false, 404, 'Email already used', null);
        }
        baseResponse(res, true, 201, 'User created', user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || 'Server error', error);
    }
}

exports.login = async (req, res) => {
    if (!req.query.email || !req.query.password) {
        return baseResponse(res, false, 400, 'Missing email or password');
    }
    try {
        const user = await userRepository.login({ email: req.query.email, password: req.query.password });
        if (!user) {
            return baseResponse(res, false, 404, 'Invalid email or password', null);
        }
        baseResponse(res, true, 200, 'Login success', user);
    } catch (error) {
        baseResponse(res, false, 500, error.message || 'Server error', error);
    }
}

exports.getUserByEmail = async (req, res) => {
    try {
        if (!req.params.email) {
            return baseResponse(res, false, 400, 'Missing email', null);
        }
        const user = await userRepository.getUserByEmail(req.params.email);
        if (!user) {
            return baseResponse(res, false, 404, 'User not found', null);
        }
        baseResponse(res, true, 200, 'User found', user);
    } catch (error) {
        baseResponse(res, false, 500, 'Error retrieving user', error);
    }
}

exports.updateUser = async (req, res) => {
    if (!req.body.id || !req.body.email || !req.body.password || !req.body.name) {
        return baseResponse(res, false, 400, 'Missing user id, email, password, or name', null);
    }
    let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regex.test(req.body.email)) {
        return baseResponse(res, false, 400, 'Invalid email', null);
    }
    let regexPassword = /^(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!regexPassword.test(req.body.password)) {
        return baseResponse(res, false, 400, 'Password must contain at least 8 characters, 1 number, and 1 special character', null);
    }
    try {
        const user = await userRepository.updateUser({ id: req.body.id, email: req.body.email, password: req.body.password, name: req.body.name });
        if (!user) {
            return baseResponse(res, false, 404, 'User not found', null);
        }
        baseResponse(res, true, 200, 'User updated', user);
    } catch (error) {
        baseResponse(res, false, 500, 'Error updating user', error);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        if (!req.params.id) {
            return baseResponse(res, false, 400, 'Missing user id', null);
        }
        const user = await userRepository.deleteUser(req.params.id);
        if (!user) {
            return baseResponse(res, false, 404, 'User not found', null);
        }
        baseResponse(res, true, 200, 'User deleted', user);
    } catch (error) {
        baseResponse(res, false, 500, 'Error deleting user', error);
    }
}

exports.topUpUser = async (req, res) => {
    try {
        if (!req.query.id) {
            return baseResponse(res, false, 400, 'Missing user_id', null);
        }
        if (!req.query.amount) {
            return baseResponse(res, false, 400, 'Missing amount', null);
        }
        let regex = /^[0-9]+$/;
        if (!regex.test(req.query.amount)) {
            return baseResponse(res, false, 400, 'Amount must be a number', null);
        }
        if (req.query.amount < 0) {
            return baseResponse(res, false, 400, 'Amount must be larger than 0', null);
        }
        req.query.amount = parseInt(req.query.amount);
        const user = await userRepository.topUpUser({ id: req.query.id, amount: req.query.amount });
        if (!user) {
            return baseResponse(res, false, 404, 'User not found', null);
        }
        baseResponse(res, true, 200, 'User topped up', user);
    } catch (error) {
        baseResponse(res, false, 500, 'Error topping up user', error);
    }
}