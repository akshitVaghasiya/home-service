import mongoose, { Schema } from 'mongoose';
const workerModel = new mongoose.Schema({
    avatar: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    password: { type: String },
    skills: { type: Schema.Types.ObjectId, ref: "Category" },
    location: { type: String },
    address: {
        houseNo: { type: String },
        streetName: { type: String },
        landMark: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String, min: 6, max: 6 },
    },
    schedule: [
        {
            title: { type: String },
            start: {
                type: Date,
                min: [new Date(), "can't be before now!!"],
            },
            end: {
                type: Date,
            },
            description: { type: String },
            type: { type: String },
        },
    ],
    loginToken: [
        {
            token: {
                type: String,
            },
        },
    ],
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

workerModel.set("timestamps", true);

export default mongoose.model("worker", workerModel);
