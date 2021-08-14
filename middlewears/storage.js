const catServices = require('../services/cats');

module.exports = () => (req, res, next) => {
    req.storage = {
        ...catServices
    };
    next();
};