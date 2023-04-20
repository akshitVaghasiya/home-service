import dbService from "../../utilities/dbService";
import { sendEmail } from "../../utilities/sendEmail";
import {
  encryptpassword,
  decryptPassword,
  generateJwtTokenFn,
  generateRandom,
} from "../../utilities/universal";
const ObjectId = require("mongodb").ObjectID;


/*************************** addWorker ***************************/
export const addWorker = async (req, res) => {
  console.log("req service =>", req.body);
  let payload = req.body;
  const { email } = req.body;
  console.log("email =>", email);
  const { filename } = req.file;

  let customerData = await dbService.findOneRecord("workerModel", {
    email: email,
  });
  console.log("customerData =>", customerData);
  if (customerData) {
    throw new Error("Email Address Already Exists!");
  } else {
    console.log("req.body.password =>", req.body.password);
    let password = await encryptpassword(req.body.password);
    console.log("encryptpassword  password =>", password);
    console.log("still we have req.body.password =>", req.body.password);
    req.body.password = password;
    console.log("after we have req.body.password =>", req.body.password);

    let data = {
      avatar: payload?.avatar,
      firstName: payload?.firstName,
      lastName: payload?.lastName,
      email: payload?.email,
      phone: payload?.phone,
      address: JSON.parse(payload?.address),
      gender: payload?.gender,
      skills: payload?.skills,
      location: payload?.location,
      password: payload?.password,
      isVerified: payload?.isVerified,
      isActive: payload?.isActive,
    }

    if (filename) {
      data = {
        ...data,
        ...{
          avatar: filename,
        }
      }
    }

    let userData = await dbService.createOneRecord("workerModel", data);

    // let token = await generateJwtTokenFn({ userId: userData._id });
    // let updateData = {
    //   $push: {
    //     loginToken: {
    //       token: token,
    //     },
    //   },
    //   lastLoginDate: Date.now(),
    // };

    // let data = await dbService.findOneAndUpdateRecord(
    //   "workerModel",
    //   { _id: userData._id },
    //   updateData,
    //   { new: true }
    // );

    // const options = {
    //   expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    //   httpOnly: true,
    // };
    // res.cookie("token", token, options);

    return userData;
  }
};

/*************************** getWorker ***************************/
export const getWorker = async (req, res, next) => {
  let postData = req.body;
  console.log("postdata=>", postData);
  let { page = 1, limit = 0 } = req.body;
  let skip = limit * page - limit;
  let where = {
    isVerified: true,
    isDeleted: false,
  };

  if (postData.searchText) {
    where = {
      ...where,
      ...{
        $or: [
          { firstName: { $regex: postData.searchText, $options: "i" } },
          { lastName: { $regex: postData.searchText, $options: "i" } },
          { email: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
  }
  // if (postData.selectText) {
  //   where = {
  //     ...where,
  //     ...{
  //       categoryId: { $in: postData.selectText }
  //     },
  //   };
  // }
  let sort = {};

  if (postData.sortBy && postData.sortMode) {
    if (postData.sortBy) {
      sort[postData.sortBy] = postData.sortMode;
      console.log("in if sort");
    }
  } else {
    sort["_id"] = -1;
  }
  console.log("where=>", where);

  let totalrecord = await dbService.recordsCount("workerModel", where);
  let results = await dbService.findManyRecordsWithPagination("workerModel",
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
};

export const updateWorker = async (req, res) => {
  console.log("req------>", req);
  let payload = req.body;
  const { userId } = req.user;
  const { filename } = req.file;
  const { id } = req.query;
  let _id = id ? id : userId;

  let userData = await dbService.findOneRecord("workerModel", {
    _id: ObjectId(_id),
    isDeleted: false,
  });

  let data = {
    avatar: payload?.avatar,
    firstName: payload?.firstName,
    lastName: payload?.lastName,
    email: payload?.email,
    phone: payload?.phone,
    address: JSON.parse(payload?.address),
    gender: payload?.gender,
    skills: payload?.skills,
    location: payload?.location,
    password: payload?.password,
    isVerified: payload?.isVerified,
    isActive: payload?.isActive,
  }

  if (filename) {
    data = {
      ...data,
      ...{
        avatar: filename,
      }
    }
  }

  if (!userData) throw new Error("user not found!");

  let project = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: ObjectId(_id) },
    { ...data, updatedAt: Date() },
    { runValidators: true, new: true }
  );

  return {
    data: project,
    message: "data updated successfully."
  };
};

/*************************** updateWorkerPassword ***************************/
export const updateWorkerPassword = async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;

  let workerData = await dbService.findOneRecord("workerModel", {
    _id: userId,
    isDeleted: false,
  });

  if (!workerData) throw new Error("user not found!");

  let match = await decryptPassword(payload.oldPassword, workerData.password);
  console.log("match->", match);
  if (!match){
    throw new Error("old Password is Invalid");
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new Error("new Password and confirm Password must be same!");
  }

  let password = await encryptpassword(req.body.newPassword);
  req.body.oldPassword = password;

  let project = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: workerData._id },
    {
      password: password,
      updatedAt: Date(),
    },
    { new: true }
  );

  return "Password updated successfully";
};

/*************************** forgotPassword ***************************/
export const forgotPassword = async (req, res) => {
  const payload = req.body;

  let resetPasswordToken = await generateRandom();

  let workerData = await dbService.findOneAndUpdateRecord(
    "workerModel",
    {
      // _id: userId,
      email: payload.email,
      isDeleted: false,
    },
    {
      resetPasswordToken: resetPasswordToken,
      resetPasswordExpire: Date.now() + 15 * 60 * 1000,
    },
    { new: true }
  );

  if (!workerData) throw new Error("something wrong!");

  const resetPasswordUrl = `http://localhost:3002/resetpassword/${resetPasswordToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    let emailResponse = await sendEmail({
      email: workerData.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    let emailSuccessMessage = `email send successfully ${payload.email}`;

    return {
      message: emailSuccessMessage,
    };
  } catch (error) {
    throw new Error("Email Not send! something wrong please try again.");
  }
};

/*************************** Reset Password from Link ***************************/
export const resetPassword = async (req, res) => {
  const payload = req.body;

  if (payload.password !== payload.confirmPassword) {
    throw new Error("Password and confirm password must be same!", 400);
  }

  let workerData = await dbService.findOneRecord("workerModel", {
    resetPasswordToken: payload.resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    isDeleted: false,
  });

  if (!workerData){
    throw new Error("Reset Password Token is invalid or has been expired", 400);
  }

  let password = await encryptpassword(payload.password);

  let result = await dbService.findOneAndUpdateRecord(
    "workerModel",
    {
      _id: workerData._id,
    },
    {
      $set: { password: password },
      $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 },
    },
    { new: true }
  );

  return {
    data: result,
    message: "Password Reset Succesfully",
  };
};

/*************************** loginAdmin ***************************/
export const onLogin = async (req, res, next) => {
  const payload = req.body;
  console.log("payload==>", payload);
  let userData = await dbService.findOneRecord("workerModel", {
    email: payload.email.toLowerCase(),
    isActive: true,
    isVerified: true,
    isDeleted: false,
  });
  if (!userData) throw new Error("Worker not found");

  let match = await decryptPassword(payload.password, userData.password);
  if (!match) throw new Error("Password Invalid");
  // if (userData.isMailVerified == false) throw new Error("Please verify email");

  if (userData?.loginToken) {
    if (userData?.loginToken?.length >= 1) {
      let rr = await dbService.findOneAndUpdateRecord(
        "workerModel",
        { _id: userData._id },
        {
          $pop: { loginToken: -1 },
        },
        { new: true }
      );
    }
  }

  let token = await generateJwtTokenFn({ userId: userData._id });
  let updateData = {
    $push: {
      loginToken: {
        token: token,
      },
    },
    lastLoginDate: Date.now(),
  };

  let data = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: userData._id },
    updateData,
    { new: true }
  );

  // res.setHeader("Access-Control-Expose-Headers", "token");
  // res.setHeader("token", data.loginToken[data.loginToken.length - 1].token);

  const options = {
    expires: new Date(
      Date.now() + 10 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.cookie("token", token, options)

  return {
    ...data._doc
  };
};

// Get Admin Detail
export const getWorkerWithId = async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  let _id = payload.id ? payload.id : userId;
  console.log("payload-->", payload);
  console.log("userId--->", userId);

  let workerData = await dbService.findOneRecord("workerModel", {
    _id: ObjectId(_id),
    isDeleted: false,
  });

  if (!workerData) throw new Error("worker not found!");

  return workerData;
};

// Logout Admin
export const logout = async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  return {
    success: true,
    message: "Logged Out",
  };
};

// addEvent
export const addEvent = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user

  let eventData = {
    $push: {
      schedule: {
        title: postData?.title,
        start: postData?.start,
        end: postData?.end,
        description: postData?.description,
        type: postData?.type,
      },
    },
    // lastLoginDate: Date.now(),
  };

  let data = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: ObjectId(userId) },
    eventData,
    { new: true }
  );

  return {
    data: data,
    message: 'event added successfully',
  };
};

// getEvent
export const getEvent = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user

  let eventData = await dbService.findOneRecord("workerModel", {
    _id: ObjectId(userId),
  },
    {
      "schedule": 1,
      "_id": 0,
    }
  );

  return eventData;
};

// getSingleEvent
export const getSingleEvent = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user

  let eventData = await dbService.findOneRecord("workerModel",
    {
      _id: ObjectId(userId),
      schedule: {
        $elemMatch: {
          _id: ObjectId(postData._id),
        }
      }
    },
    {
      "_id": 0,
      "schedule.$": 1,
    }
  );
  return eventData;
};

// deleteEvent
export const deleteEvent = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user

  let eventData = await dbService.findOneAndUpdateRecord("workerModel",
    { _id: ObjectId(userId) },
    {
      $pull: {
        schedule: {
          _id: ObjectId(postData.id),
        }
      }
    },
    { new: true }
  );

  return eventData;
};

// updateEvent
export const updateEvent = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user;
  const { id } = req.query;

  let eventData = await dbService.findOneAndUpdateRecord("workerModel",
    {
      _id: ObjectId(userId),
      "schedule._id": ObjectId(id),
    },
    {
      '$set': { 'schedule.$': postData }
    }
    ,
    { new: true }
  );

  console.log("eventData--->", eventData);

  return "event updated successfully";
};

// getRequest
export const getRequest = async (req, res, next) => {
  let postData = req.body;
  let { userId } = req.user

  let workerData = await dbService.findOneRecord('workerModel',
    {
      _id: ObjectId(userId),
    }
  );

  let match = {
    categoryId: ObjectId(workerData.skills),
    "serviceLocation.pinCode": workerData.location,
    status: "pending",
  }

  if (Object.keys(workerData.schedule).length > 0) {
    match = {
      ...match,
      ...{
        $or: workerData.schedule.map(unavailability => ({
          $or: [
            {
              "startTime": { $lt: new Date(unavailability.start) },
              "endTime": { $lte: new Date(unavailability.start) }
            },
            {
              "startTime": { $gte: new Date(unavailability.end) },
              "endTime": { $gt: new Date(unavailability.end) }
            },
            {
              "startTime": { $gte: new Date(unavailability.start) },
              "endTime": { $lte: new Date(unavailability.end) }
            }
          ]
        }))
      }
    }
  }

  let orderData = await dbService.aggregateData('orderModel',
    [
      {
        $match: match
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
      // {
      //   $unwind: "$items"
      // },
      // {
      //   $lookup: {
      //     from: "services",
      //     localField: "items.serviceId",
      //     foreignField: "_id",
      //     as: "serviceDetail"
      //   }
      // },
    ]
  );

  console.log("orderDataorderData----->", orderData);
  return orderData;
};

// updateRequest
export const updateRequest = async (req, res, next) => {
  console.log("req->", req);
  let postData = req.body;
  let { userId } = req.user;
  const { id } = req.query;

  if (postData.workerId) {
    userId = postData.workerId
    console.log("userId in if--->", userId);
  }
  console.log("userId--->", userId);
  let payload = {
    status: postData.status,
    workerId: userId,
  }

  if (postData.status == 'confirmed') {
    let otp = await generateRandom(4, false);
    console.log("otp----->", otp);

    payload = {
      ...payload,
      ...{
        startServiceCode: otp,
      }
    }
  }

  let requestData = await dbService.findOneAndUpdateRecord("orderModel",
    {
      _id: ObjectId(id)
    },
    payload,
    {
      new: true
    }
  );

  let eventData = {
    $push: {
      schedule: {
        title: 'work',
        start: requestData?.startTime,
        end: requestData?.endTime,
        description: 'work',
        type: 'work',
        orderId: requestData._id,
      },
    },
  };

  let data = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: ObjectId(userId) },
    eventData,
    { new: true }
  );

  console.log("eventData--->", requestData);

  return "request accepted successfully";
};