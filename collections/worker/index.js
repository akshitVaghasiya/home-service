import mongoose, { Schema } from 'mongoose';
const workerModel = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    password: { type: String },
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
            title: { type: String, required: [true, "Please write a title for your event"] },
            start: {
                type: Date,
                required: [true, "Please Insert The Start of your event"],
                min: [new Date(), "can't be before now!!"],
            },
            end: {
                type: Date,
                //setting a min function to accept any date one hour ahead of start
                min: [function () {
                    const date = new Date(this.start)
                    const validDate = new Date(date.setHours(date.getHours() + 1))
                    return validDate
                }, "Event End must be at least one hour a head of event time"],
                default: function () {
                    const date = new Date(this.start)
                    return date.setDate(date.getDate() + 1)
                },
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
