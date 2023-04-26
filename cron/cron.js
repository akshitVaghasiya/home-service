import dbService from '../utilities/dbService';
const ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
import { sendEmail } from "../utilities/sendEmail";

export const cancelOrder = async (eTime, sTime) => {

    console.log("eTime->", eTime);
    console.log("sTime->", sTime);

    let where = {
        status: "pending",
        $and: [
            { "startTime": { $gte: eTime } },
            { "startTime": { $lt: sTime } },
        ],
    };
    let payload = {
        status: "cancelled",
    };

    let results = await dbService.findOneAndUpdateRecord('orderModel', where, payload);

    console.log("results--------------->", results);

    if (!results) throw new Error("something wrong!");

    let customerData = await dbService.findOneRecord('customerModel',
        {
            _id: ObjectId(results.customerId),
        }
    );

    console.log("customerData----------->", customerData);

    if (!customerData) throw new Error("customer not found!");

    const message = `Your order was cancelled because no worker available.`;

    try {
        let emailResponse = await sendEmail({
            email: customerData.email,
            subject: `Homebuddy order cancelled`,
            message,
        });

        let emailSuccessMessage = `email send successfully ${customerData.email}`;
        console.log("emailSuccessMessage------>", emailSuccessMessage);
        return {
            message: emailSuccessMessage,
        };
    } catch (error) {
        throw new Error("Email Not send! something wrong please try again.");
    }
}