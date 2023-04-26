var cron = require('node-cron');
import dbService from '../utilities/dbService';
const ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
import { cancelOrder } from './cron';
var moment = require("moment")

cron.schedule('* * * * *', async () => {

    // let eTime = moment().seconds(0).millisecond(0).valueOf() - 300000;
    // let sTime = moment().seconds(0).millisecond(0).valueOf();

    let currentDate = new Date();
    let fiveMinutesAgo = new Date(currentDate.getTime() - 5 * 60 * 1000);
    let twoHoursLater2 = new Date(currentDate.getTime() + 2 * 55 * 60 * 1000);
    let twoHoursLater = new Date(currentDate.getTime() + 2 * 60 * 60 * 1000);

    console.log("twoHoursLater2------>",twoHoursLater2);
    console.log("twoHoursLater------>",twoHoursLater);

    let results = await cancelOrder(twoHoursLater2, twoHoursLater);
    console.log("results->", results);

}, {
    scheduled: false,
    timezone: "Asia/Kolkata"
});