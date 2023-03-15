import mongoose from 'mongoose';
const serviceModel = new mongoose.Schema({
    serviceName: { type: String },
    subcategoryId: { type: Schema.Types.ObjectId, ref: 'subcategory' },
    serviceCharge: { type: Number},
    image: { type: String },
    duration: { type: Number },
    price: { type: Number },
    description: { type: String },
    included: [{ type: String }],
    excluded: [{ type: String}],
    query: [{
        question: { type: String },
        answer: { type: String }, 
    }],
    isActive: { type: Boolean, default: true},
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

serviceModel.set("timestamps", true);

export default mongoose.model("service", serviceModel);
