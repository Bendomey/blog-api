import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String,
        enum: ['m', 'f'],
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
}, {
    toJson: {
        virtuals: true,
    },
    toObject: {
        virtuals: true
    }
});

UserSchema.virtual('blogs', {
    ref: 'Blog',
    localField: '_id',
    foreignField: 'userId'
});

export default mongoose.model('User', UserSchema);