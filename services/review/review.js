import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import {
  generateRandom,
} from "../../utilities/universal";

export const addReview = async (req, res) => {
  const {serviceId, orderId, rating, description, _id} = req.body;
  const { userId } = req.user;
  // console.log("payload--->", req.body);

  let orderData = await dbService.findOneRecord(
    "orderModel",
    {
      _id: ObjectId(orderId),
      status: "completed"
    },
  );

  if(!orderData) {
    throw new Error("Order not completed")
  }

  let reviewData = await dbService.createOneRecord('reviewModel',
    {
      customerId: userId,
      serviceId,
      orderId,
      rating,
      description
    }
  );
  if (reviewData) {
    let result = await dbService.findOneAndUpdateRecord(
      "orderModel",
      {
        _id: ObjectId(orderId),
        items: { $elemMatch: { _id: ObjectId(_id) } },
      },
      {
        $set: { "items.$.reviewId": reviewData._id },
      },
      { new: true }
    );
    return "review added successfully";
  } else {
    throw new Error("something wrong!")
  }
}

export const getReview = async (req, res) => {
  const {reviewId} = req.body;
  // const { userId } = req.user;
  // console.log("payload--->", req.body);

  let reviewData = await dbService.findOneRecord(
    "reviewModel",
    {
      _id: ObjectId(reviewId),
    },
  );

  if(!reviewData) {
    throw new Error("Review not found")
  }

  return reviewData
}

export const getReviewByService = async (req, res) => {
  const { serviceId } = req.body;
  // console.log("payload--->", req.body);

  const reviewData = await dbService.aggregateData("reviewModel", [
    {
      $match: {
        serviceId: ObjectId(serviceId),
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        pipeline: [
          {
            $project: {
              _id: 1,
              firstName: 1,
              lastName: 1
            },
          },
        ],
        as: "userData",
      },
    },
  ]);

  if(!reviewData) {
    throw new Error("Something went wrong!")
  }

  return reviewData
}