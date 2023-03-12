import mongoose from 'mongoose';
const customerSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    address: {
        houseNo: { type: String },
        streetName: { type: String },
        landMark: { type: String },
        city: { type: String },
        state: { type: String },
        pinCode: { type: String, min: 6, max: 6 },
    },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    loginToken: [
        {
            token: {
                type: String,
            },
        },
    ],
    isEnabled: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    lastLoginDate: { type: Number },
    deletedAt: Number,
    isUpdated: Boolean,
    createdAt: { type: Date, default: Date() },
    updatedAt: { type: Date, default: Date() },
    resetPasswordToken: String,
    resetPasswordExpire: Number,
});

export default mongoose.model("customer", customerSchema);


// loginToken: [
//     {
//         token: {
//             type: String,
//         },
//     },
// ],