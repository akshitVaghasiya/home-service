import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { unlink } from "node:fs";
const path = require("path");

// --------------- get category wise cart details ----------------
export const getCategoryWiseCart = async (req, res) => {
  const payload = req.body;
  const user = req.user;
  console.log("user id ====>>>>>", user.userId);

  let category = await dbService.findOneRecord(
    "categoryModel",
    {
      categoryName: payload.categoryName,
    },
    { project: { _id: 1 } }
  );
  if (!category) throw new Error("Category not available");

  const project = await dbService.aggregateData("cartModel", [
    {
      $match: {
        customerId: ObjectId(user.userId),
      },
    },
    {
      $unwind: "$items",
    },
    {
      $match: {
        "items.categoryId": ObjectId(category),
      },
    },
    {
      $lookup: {
        from: "services",
        localField: "items.serviceId",
        foreignField: "_id",
        let: {
          quantity: "$items.quantity",
        },
        pipeline: [
          {
            $project: {
              _id: 1,
              subCategoryId: 1,
              serviceName: 1,
              image: 1,
              duration: 1,
              price: 1,
              // subTotal: {
              //   $sum: {
              //     $multiply: [$$price, $$quantity],
              //   },
              // },
            },
          },
        ],
        as: "serviceData",
      },
    },
  ]);

  let subTotal = 0;

  project.forEach((value) => {
    let serivceTotal = value.serviceData[0].price * value.items.quantity
    subTotal += serivceTotal
  })

  return {cartData: project, subTotal};
};

export const getServiceWiseCart = async (req, res) => {
  const payload = req.body;
  const user = req.user;

  let service = await dbService.findOneRecord(
    "serviceModel",
    {
      _id: payload.serviceId,
    },
    { project: { _id: 1 } }
  );
  if (!service) throw new Error("Service not available");

  const project = await dbService.aggregateData("cartModel", [
    {
      $unwind: "$items",
    },
    {
      $match: {
        "items.serviceId": ObjectId(service),
      },
    },
  ]);
  // const project = await dbService.findAllRecords("cartModel", {
  //   customerId: ObjectId(user._id),
  //   items: { $elemMatch: { categoryId: ObjectId(category) } },
  // });

  return project[0];
};

// --------------- add To Cart ----------------
export const addToCart = async (req, res) => {
  const payload = req.body;
  const user = req.user;

  if (payload.quantity <= 0) {
    console.log("quantity====>>>>", payload.quantity);
    const result = await dbService.findOneAndUpdateRecord(
      "cartModel",
      {
        customerId: ObjectId(user._id),
        items: { $elemMatch: { serviceId: ObjectId(payload.serviceId) } },
      },
      { $pull: { items: { serviceId: ObjectId(payload.serviceId) } } },
      { new: true }
    );
    // if (result) {
    return "Cart updated successfully";
    // } else {
    //   throw new Error("Something went Wrong");
    // }
  }

  let category = await dbService.findOneRecord(
    "categoryModel",
    {
      categoryName: payload.categoryName,
    },
    { project: { _id: 1 } }
  );
  console.log("category _id ===>>>", category);
  if (!category) throw new Error("Category not available");

  let subCategory = await dbService.findOneRecord("subCategoryModel", {
    _id: ObjectId(payload.subCategoryId),
  });
  if (!subCategory) throw new Error("SubCategory not available");

  let service = await dbService.findOneRecord("serviceModel", {
    _id: ObjectId(payload.serviceId),
  });
  if (!service) throw new Error("Service not available");

  const userComp = await dbService.findOneRecord("cartModel", {
    customerId: ObjectId(user._id),
    // items: { $elemMatch: { serviceId: ObjectId(payload.serviceId) } },
  });

  if (!userComp) {
    console.log("use not found");
    let project = await dbService.createOneRecord("cartModel", {
      customerId: ObjectId(user._id),
      items: {
        categoryId: category,
        subCategoryId: payload.subCategoryId,
        serviceId: payload.serviceId,
        quantity: payload.quantity,
      },
    });
    if (project) {
      return "Cart update successfully";
    } else {
      throw new Error("Something Wrong");
    }
  }

  const serviceComp = await dbService.findOneRecord("cartModel", {
    customerId: ObjectId(user._id),
    items: { $elemMatch: { serviceId: ObjectId(payload.serviceId) } },
  });
  console.log("service Comp ===>>>", serviceComp);

  if (serviceComp) {
    const project = await dbService.findOneAndUpdateRecord(
      "cartModel",
      {
        customerId: ObjectId(user._id),
        items: { $elemMatch: { serviceId: ObjectId(payload.serviceId) } },
      },
      {
        $set: { "items.$.quantity": payload.quantity },
      }
    );
    if (project) {
      return "Cart update successfully";
    } else {
      throw new Error("Something Wrong");
    }
  } else {
    const project = await dbService.findOneAndUpdateRecord(
      "cartModel",
      {
        customerId: ObjectId(user._id),
      },
      {
        $push: {
          items: {
            categoryId: category,
            ...payload,
          },
        },
      }
    );
    if (project) {
      return "Cart update successfully";
    } else {
      throw new Error("Something Wrong");
    }
  }

  return "Cart update successfully";
};
