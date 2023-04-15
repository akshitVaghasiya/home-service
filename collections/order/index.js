import mongoose, { Schema } from 'mongoose';

const orderModel = new mongoose.Schema({
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", require: true },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", require: true },
    workerId: { type: Schema.Types.ObjectId, ref: "Worker", require: true },
    items: [
        {
            subCategoryId: { type: Schema.Types.ObjectId, ref: "subcategory", require: true },
            serviceId: { type: Schema.Types.ObjectId, ref: "service", require: true },
            quantity: { type: Number },
            price: { type: Number },
            total: { type: Number },
            image: { type: String },
        }
    ],
    startServiceCode: { type: String },
    endServiceCode: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
    totalTime: { type: String },
    status: { type: String, default: 'pending' }, // pending, confirmed, working, completed, cancelled
    paymentMode: { type: String, default: 'COD' },
    grandTotal: { type: String },
    tax: { type: String },
    subTotal: { type: String },
    orderFee: { type: String, default: '60' },
    serviceLocation: {
        address: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String, min: 6, max: 6 },
    },
    ratingId: { type: String },

    // createdAt: { type: Date, default: Date() },
    // updatedAt: { type: Date, default: Date() },
});

orderModel.set("timestamps", true);

export default mongoose.model("order", orderModel);
