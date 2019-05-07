import Country from './../models/Country.js';

Country.countDocuments(function (err, c) {
    if (c == 0) {
        var arr = [{ name: "US", capital: "Washington, D.C" }, { name: "UK", capital: "London" }, { name: "India", capital: "New Delhi" }];
        Country.insertMany(arr, function (err, docs) {
            if (err) {
                console.log(err);
            } else {
                console.log(docs);
            }
        });
    }
});