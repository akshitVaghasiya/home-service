import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
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
        status: { $in: ['confirmed', 'completed'] }
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