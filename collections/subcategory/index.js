import mongoose from 'mongoose';
const subCategoryModel = new mongoose.Schema({
    subCategoryName: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: 'category' },
    image: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

subCategoryModel.set("timestamps", true);

export default mongoose.model("subcategory", subCategoryModel);
