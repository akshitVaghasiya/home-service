import dbService from '../utilities/dbService';
const ObjectId = require('mongodb').ObjectID;
const nodemailer = require('nodemailer');

export const dripCampaign = async (eTime, sTime) => {

    console.log("eTime->", eTime);
    console.log("sTime->", sTime);

    let aggregateQuery = [
        {
            $match: {
                isDeleted: false,
                dripBreakDown: {
                    $elemMatch: {
                        $and: [
                            { "timeStamp": { $gt: eTime } },
                            { "timeStamp": { $lt: sTime } },
                        ]
                    }
                },
            }
        },
        {
            $project: {
                productName: 1,
                productPrice: 1,
                dripBreakDownLength: { $size: "$dripBreakDown" },
                index: {
                    $indexOfArray: [
                        {
                            $map: {
                                input: "$dripBreakDown",
                                in: {
                                    $cond: [{
                                        $and: [
                                            { $gt: ["$$this.timeStamp", eTime] },
                                            { $lt: ["$$this.timeStamp", sTime] },
                                        ]
                                    }, 1, 0]
                                }
                            }
                        },
                        1
                    ]
                },
                dripBreakDown: {
                    $filter: {
                        input: "$dripBreakDown",
                        as: "break",
                        cond: {
                            $and: [
                                { $gt: ["$$break.timeStamp", eTime] },
                                { $lt: ["$$break.timeStamp", sTime] },
                            ]
                        }
                    }
                }
            }
        }
    ];

    let results = await dbService.aggregateData("productModel", aggregateQuery);

    if (results) {
        for (let data of results) {
            if (data.dripBreakDown) {
                for (let breakData of data.dripBreakDown) {
                    switch (breakData.action) {
                        case 2: // for email
                            // Create a transporter object
                            let transporter = nodemailer.createTransport({
                                service: 'gmail',
                                host: 'smtp.gmail.com',
                                port: 587,
                                secure: false,
                                auth: {
                                    user: 'akshitvaghasiya2003@gmail.com',
                                    pass: 'qpsmgqjwtdjkjiga',
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });

                            // Create a message object
                            let message = {
                                from: 'akshitvaghasiya2003@gmail.com',
                                to: 'akshitvaghasiya813@gmail.com',
                                subject: data.productName,
                                text: breakData.message,
                                html: `<div>
                                          <h3>Product Message : </h3>
                                          <p>${breakData.message}</p>
                                       </div>`,
                            };
                            // Send the email
                            transporter.sendMail(message, (err, info) => {
                                if (err) {
                                    console.log(err);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });
                            break;

                        default:
                            break;
                    }
                }
            }

            if (data.dripBreakDownLength === data.index + 1) {
                let project = await dbService.findOneAndUpdateRecord("productModel",
                    { _id: ObjectId(data._id) },
                    {
                        // $unset: { dripBreakDown: "" },
                        $set: { isDripBreakDown: false },
                    }
                );

            }
        }
    }

    return results;
};

export const removeDripCampaign = async (eTime, sTime) => {
    console.log("eTime->", eTime);
    console.log("sTime->", sTime);
    let where = {
        isDripBreakDown: false,
        $exists: { dripBreakDown: true },
    };
    let payload = {

    };
    let results = await dbService.findOneAndUpdateRecord(['productModel'], where, payload);
}