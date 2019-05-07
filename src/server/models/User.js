import mongoose from 'mongoose';
const Schema = mongoose.Schema;

var userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String }
}, {
        collection: 'User',
        versionKey: false,
        timestamps: {
            createdAt: "createdAt",
            updatedAt: "updatedAt"
        }
    }
);

var User = mongoose.model('User', userSchema);

export default User;