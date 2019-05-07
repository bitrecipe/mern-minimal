import Country from './../models/Country.js';

export function getCountries(req, res, next) {
    Country.find({}).lean().exec().then(function (docs) {
        res.json({ data: docs, error: null, message: null });
    }).catch(function (err) {
        console.log(err);
        res.status(500).json({ data: null, error: { subject: "server" }, message: err.toString() });
    });
}