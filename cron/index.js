var cron = require('node-cron');
import dbService from '../utilities/dbService';
const ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');
var moment = require("moment")

cron.schedule('* * * * *', async () => {

    // console.log('eTime ' + eTime);
    console.log("before results->", new Date());

    console.log("after results->", new Date());

}, {
    scheduled: false,
    timezone: "Asia/Kolkata"
});