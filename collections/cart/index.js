import mongoose, { Schema } from 'mongoose';
const cartModel = new mongoose.Schema({
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", require: true},
    items: [
        {
            categoryId: { type: Schema.Types.ObjectId, ref: "Category", require: true},
            subCategoryId: { type: Schema.Types.ObjectId, ref: "subcategory", require: true},
            serviceId: { type: Schema.Types.ObjectId, ref: "service", require: true},
            quantity: { type: Number },
            createdAt: { type: Date, default: Date() },
        }
    ]
    // image: { type: String },
    // description: { type: String },
    // isActive: { type: Boolean, default: true },
    // isDeleted: { type: Boolean, default: false },
    // deletedAt: Number,
    // isUpdated: Boolean,
    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

cartModel.set("timestamps", true);

export default mongoose.model("cart", cartModel);
