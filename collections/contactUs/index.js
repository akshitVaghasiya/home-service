import mongoose, { Schema } from 'mongoose';
const contactUsModel = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    message: { type: String },
    read: { type: Boolean, default: false },
    status: { type: String }, // open, inProgress, closed
    contactType: { type: String }, // user, worker, joining
    title: { type: String },
    response: { type: String },
    // deletedAt: Number,
    // isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

contactUsModel.set("timestamps", true);

export default mongoose.model("contactUs", contactUsModel);
