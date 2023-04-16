import mongoose, { Schema } from 'mongoose';
const reviewModel = new mongoose.Schema({
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", require: true},
    serviceId: { type: Schema.Types.ObjectId, ref: "service", require: true},
    rating: { type: Number },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
    // deletedAt: Number,
    // isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

reviewModel.set("timestamps", true);

export default mongoose.model("review", reviewModel);
