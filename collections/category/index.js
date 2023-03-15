import mongoose from 'mongoose';
const categorySchema = new mongoose.Schema({
    categoryName: { type: String },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    description: { type: String },
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

categorySchema.set("timestamps", true);

export default mongoose.model("category", categorySchema);
