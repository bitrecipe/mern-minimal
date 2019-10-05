import Country from './../models/Country.js';
import logger from './../middlewares/logger.js';

export function getCountries(req, res, next) {
    Country.find({}).lean().exec().then(function (docs) {
        res.json({ data: docs, error: null, message: null });
    }).catch(function (err) {
        logger.error(err);
        res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
    });
}