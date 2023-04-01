import mongoose, { Schema } from 'mongoose';
const subCategoryModel = new mongoose.Schema({
    subCategoryName: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", require: true},
    image: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: Number,
    isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

subCategoryModel.set("timestamps", true);

export default mongoose.model("subcategory", subCategoryModel);
