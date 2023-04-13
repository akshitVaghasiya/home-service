import dbService from "../../utilities/dbService";
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
  const { email } = req.body;
  console.log("email =>", email);
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
    let userData = await dbService.createOneRecord("workerModel", req.body);

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
  const payload = req.body;
  const { userId } = req.user;
  const { id } = req.query;
  let _id = id ? id : userId;

  let userData = await dbService.findOneRecord("workerModel", {
    _id: ObjectId(_id),
    isDeleted: false,
  });

  if (!userData) throw new Error("user not found!");

  let project = await dbService.findOneAndUpdateRecord(
    "workerModel",
    { _id: ObjectId(_id) },
    { ...payload, updatedAt: Date() },
    { runValidators: true, new: true }
  );

  return {
    data: project,
    message: "data updated successfully."
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
  if (!userData) throw new Error("Admin not found");

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

  let userData = await dbService.findOneRecord("workerModel", {
    _id: ObjectId(_id),
    isDeleted: false,
  });

  if (!userData) throw new Error("user not found!");

  return userData;
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
    lastLoginDate: Date.now(),
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