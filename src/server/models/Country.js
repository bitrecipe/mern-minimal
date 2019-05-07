import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var countrySchema = new Schema({
    name: { type: String },
    capital: { type: String }
}, {
        collection: 'Country',
        versionKey: false,
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

var Country = mongoose.model('Country', countrySchema);

export default Country;