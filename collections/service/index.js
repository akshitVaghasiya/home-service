import mongoose, { Schema } from 'mongoose';
const serviceModel = new mongoose.Schema({
    subCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'subcategory', require: true },
    serviceName: { type: String },
    // serviceCharge: { type: Number},
    image: { type: String },
    duration: { type: Number },
    price: { type: Number },
    description: { type: String },
    included: [String],
    excluded: [String],
    FAQs: [{
        question: { type: String },
        answer: { type: String },
    }],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

serviceModel.set("timestamps", true);

export default mongoose.model("service", serviceModel);
