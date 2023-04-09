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
    //let project = await workerModel.saveQuery(req.body);
    let userData = await dbService.createOneRecord("workerModel", req.body);
    console.log("project data =>", project);

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

    const options = {
      expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.cookie("token", token, options);

    return data;
  }
};

/*************************** loginAdmin ***************************/
export const onLogin = async (req, res, next) => {
  const payload = req.body;
  console.log("payload==>", payload);
  let userData = await dbService.findOneRecord("workerModel", {
    email: payload.email.toLowerCase(),
    role: "admin",
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
export const getWorkerDetail = async (req, res, next) => {
  const payload = req.user;

  let admin = await dbService.findOneRecord("workerModel", {
    _id: payload._id,
    role: "admin",
    isDeleted: false,
  });

  return {
    ...admin._doc
  };
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

// getEvent
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

// deleteEvent
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