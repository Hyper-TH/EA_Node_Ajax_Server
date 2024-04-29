import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: { type: String, required: false },
    type: { type: String, required: false },
    product: [{
        id: { type: String, required: false },
        name: { type: String, required: false },
        price: { type: Number, required: false }
    }],
}, { strict: false });

const UserModel = mongoose.model('users', UserSchema);

export default UserModel;