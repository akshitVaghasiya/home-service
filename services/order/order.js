import { workerData } from "node:worker_threads";
import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import {
  generateRandom,
} from "../../utilities/universal";
import { unlink } from "node:fs";
const path = require("path");

export const addOrder = async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  console.log("payload--->", payload);

  let items = payload.itemData.map((data) => {
    let subCategoryId = data.items.subCategoryId
    let serviceId = data.items.serviceId
    let quantity = data.items.quantity
    let price = data.serviceData[0].price
    let total = quantity * price
    let image = data.serviceData[0].image
    let serviceName = data.serviceData[0].serviceName
    return (
      {
        subCategoryId,
        serviceId,
        quantity,
        price,
        total,
        image,
        serviceName,
      }
    )
  });

  let workerData = await dbService.findAllRecords('workerModel',
    {
      skills: ObjectId(payload.categoryId),
      location: payload.serviceLocation.pinCode,
      "schedule": {
        $not: {
          $elemMatch: {
            start: { $lt: payload.endTime }, // Check if worker's unavailability start time is before the order's end time
            end: { $gt: payload.startTime } // Check if worker's unavailability end time is after the order's start time
          }
        }
      }
    }
  )
  if (Object.keys(workerData).length <= 0) {
    throw new Error("no worker available for that time");
  }

  // console.log("worker data-->>", workerData);

  let orderPayload = {
    customerId: userId,
    categoryId: payload.categoryId,
    items: items,
    startTime: payload.startTime,
    endTime: payload.endTime,
    totalTime: payload.totalTime,
    paymentMode: payload.paymentMode,
    grandTotal: payload.grandTotal,
    tax: payload.tax,
    subTotal: payload.subTotal,
    orderFee: payload.orderFee,
    serviceLocation: payload.serviceLocation,
    phone: payload.phone
  };
  // console.log("orderPayload---->", orderPayload);
  let orderData = await dbService.createOneRecord('orderModel',
    orderPayload
  );
  if (orderData) {
    let result = await dbService.findOneAndUpdateRecord(
      "cartModel",
      {
        customerId: ObjectId(userId),
        // "items": {
        //   $elemMatch: {
        //     categoryId: payload.categoryId,
        //   }
        // },
        // categoryId: payload.categoryId,
      },
      { $pull: { items: { categoryId: ObjectId(payload.categoryId) } } },
      { new: true }
    );
    return "order placed successfully";
  }
}

/********************** getWork **********************/
export const getWork = async (req, res) => {
  let postData = req.body;
  const { userId } = req.user;
  console.log("postdata=>", postData);
  let { page = 1, limit = 0 } = req.body;
  let skip = limit * page - limit;
  let where = {
    isDeleted: false,
    workerId: ObjectId(userId),
  };

  if (postData.searchText) {
    where = {
      ...where,
      ...{
        $or: [
          { serviceName: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
  }

  if (postData.selectText) {
    where = {
      ...where,
      ...{
        status: { $in: postData.selectText }
      },
    };
  } else {
    where = {
      ...where,
      ...{
        status: { $in: ['confirmed', 'completed', 'cancelled', 'working'] }
      }
    }
  }

  let sort = {};

  if (postData.sortBy && postData.sortMode) {
    if (postData.sortBy) {
      sort[postData.sortBy] = postData.sortMode;
      console.log("in if sort");
    }
  } else {
    sort["_id"] = -1;
  }
  // console.log("where=>", where);

  let totalrecord = await dbService.recordsCount("orderModel", where);
  let results = await dbService.findManyRecordsWithPagination("orderModel",
    where,
    {
      sort,
      skip,
      limit
    }
  );

  return {
    items: results,
    page: page,
    count: totalrecord,
    limit: limit,
  };
}

/********************** get order list for user ********************/
export const getOrderList = async (req, res) => {
  let { userId } = req.user;
  let { categoryId, status } = req.body;

  const project = await dbService.aggregateData("orderModel", [
    {
      $match: {
        // customerId: ObjectId("6438e3dc2e3256b75db3a56b"),
        customerId: ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "workers",
        localField: "workerId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              password: 0,
              isVerified: 0,
              isActive: 0,
              isDeleted: 0,
              schedule: 0,
              loginToken: 0,
              createdAt: 0,
              updatedAt: 0
            },
          },
        ],
        as: "workerData",
      },
    },
    // {
    //   $lookup: {
    //   "from": "reviews",
    //   "let": {"reviewId": "$items.review_id"},
    //   pipeline: [
    //     {
    //       "$match": {
    //         "$expr": {
    //           "$in": ["$$reviewId", "$reviews._Id"],  
    //         },
    //       },
    //     },
    //   ],
    //   as: "reviewData"
    // }}
  ]);

  // console.log("order data--->>>", JSON.parse(project));

  return project
}

// getSingleWork
export const getSingleWork = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user

  let eventData = await dbService.aggregateData("orderModel",
    [
      {
        $match: {
          _id: ObjectId(postData.id),
          workerId: ObjectId(userId),
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetail"
        }
      },
      {
        $unwind: "$categoryDetail"
      },
    ],
  );
  return eventData[0];
};

// completeWork
export const completeWork = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user;
  let { id } = req.query;

  let orderData = await dbService.findOneRecord('orderModel',
    {
      _id: ObjectId(id),
    }
  );
  if (postData.status == 'working') {

    if (orderData.startServiceCode != postData.startServiceCode) {
      throw new Error("Enter valid start service code!");
    }

    let otp = await generateRandom(4, false);

    console.log("gcsdyv");
    console.log("otp----->", otp);

    let result = await dbService.findOneAndUpdateRecord(
      "orderModel",
      {
        _id: ObjectId(id),
      },
      {
        status: postData.status,
        endServiceCode: otp,
      },
      { new: true }
    );

    return "order started...";

  } else if (postData.status == 'completed') {
    if (orderData.endServiceCode != postData.endServiceCode) {
      throw new Error("Enter valid complete service code!");
    }

    let result = await dbService.findOneAndUpdateRecord(
      "orderModel",
      {
        _id: ObjectId(id),
      },
      {
        status: postData.status,
      },
      { new: true }
    );

    return "order completed...";
  } else {
    throw new Error("Something wrong Try again..");
  }

};

// getSingleWork
export const deleteWork = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user;
  let { id } = req.query;

  let result = await dbService.findOneAndUpdateRecord("orderModel",
    {
      _id: ObjectId(id),
    },
    {
      status: postData.status,
    },
    { new: true }
  );

  console.log("result------->", result);

  let workerData = await dbService.findOneAndUpdateRecord("workerModel",
    { _id: ObjectId(result.workerId) },
    {
      $pull: {
        schedule: {
          "start": new Date(result.startTime),
          "end": new Date(result.endTime),
        }
      }
    },
    { new: true }
  );

  console.log("workerData------->", workerData);

  return "order cancelled sucessfully...";
};

/********************** getOrder **********************/
export const getOrder = async (req, res) => {
  let postData = req.body;
  const { userId } = req.user;
  console.log("postdata=>", postData);
  let { page = 1, limit = 0 } = req.body;
  let skip = limit * page - limit;
  let where = {
    isDeleted: false,
  };

  if (postData.searchText) {
    where = {
      ...where,
      ...{
        $or: [
          { serviceName: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
  }

  if (postData.selectText) {
    where = {
      ...where,
      ...{
        status: { $in: postData.selectText }
      },
    };
  } else {
    where = {
      ...where,
      ...{
        status: { $in: ['confirmed', 'completed', 'cancelled', 'working', 'pending'] }
      }
    }
  }

  let sort = {};

  if (postData.sortBy && postData.sortMode) {
    if (postData.sortBy) {
      sort[postData.sortBy] = postData.sortMode;
      console.log("in if sort");
    }
  } else {
    sort["_id"] = -1;
  }
  // console.log("where=>", where);

  let totalrecord = await dbService.recordsCount("orderModel", where);
  let results = await dbService.findManyRecordsWithPagination("orderModel",
    where,
    {
      sort,
      skip,
      limit
    }
  );

  return {
    items: results,
    page: page,
    count: totalrecord,
    limit: limit,
  };
}

// getSingleWork
export const getSingleOrder = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user;

  let orderData = await dbService.findOneRecord('orderModel',
    {
      _id: ObjectId(postData.id),
    }
  );

  if (orderData.status == 'pending') {

    let orderData2 = await dbService.aggregateData("orderModel",
      [
        {
          $match: {
            _id: ObjectId(orderData._id),
          }
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "categoryDetail"
          }
        },
        {
          $unwind: "$categoryDetail",
          // preserveNullAndEmptyArrays: true
        },
        {
          $limit: 1
        }
      ]
    );

    // console.log("orderData2------>", orderData2);

    let workerData = await dbService.findAllRecords('workerModel',
      {
        skills: ObjectId(orderData.categoryId),
        location: orderData.serviceLocation.pinCode,
        "schedule": {
          $not: {
            $elemMatch: {
              start: { $lt: orderData.endTime },
              end: { $gt: orderData.startTime } 
            }
          }
        }
      }
    )

    orderData2[0].availableWorker = workerData
    // console.log("orderData2[0]------>", orderData2[0]);
    return orderData2[0];
  } else {
    console.log("in else");

    let orderData3 = await dbService.aggregateData("orderModel", [
      {
        $match: {
          _id: ObjectId(postData.id)
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryDetail"
        }
      },
      {
        $unwind: "$categoryDetail",
      },
      {
        $limit: 1
      }
    ]);

    if (orderData.workerId) {
      let worker = await dbService.findOneRecord('workerModel',
        {
          _id: ObjectId(orderData.workerId)
        }
      )
      orderData3[0].workerDetail = worker;
    }
    // console.log("orderData----------->", orderData3);
    return orderData3[0];
  }

};

// deleteOrder
export const deleteOrder = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { id } = req.query;

  let result = await dbService.findOneAndUpdateRecord("orderModel",
    {
      _id: ObjectId(id),
    },
    {
      status: postData.status,
    },
    { new: true }
  );

  console.log("result------->", result);

  let workerData = await dbService.findOneAndUpdateRecord("workerModel",
    { _id: ObjectId(result.workerId) },
    {
      $pull: {
        schedule: {
          "start": new Date(result.startTime),
          "end": new Date(result.endTime),
        }
      }
    },
    { new: true }
  );

  console.log("workerData------->", workerData);

  return "order cancelled sucessfully...";
};