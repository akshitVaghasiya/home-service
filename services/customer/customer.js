/**
 * This is for Contain function layer for contractor service.
 * @author Sandip Vaghasiya
 *
 */

import dbService from "../../utilities/dbService";
import {
  encryptpassword,
  decryptPassword,
  generateJwtTokenFn,
  generateRandom,
} from "../../utilities/universal";
import { sendEmail } from "../../utilities/sendEmail";

/*************************** addCustomer ***************************/
export const addCustomer = async (req, res) => {
  console.log("req service =>", req.body);
  const { email } = req.body;
  console.log("email =>", email);
  let customerData = await dbService.findOneRecord("customerModel", {
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
    //let project = await customerModel.saveQuery(req.body);
    let userData = await dbService.createOneRecord("customerModel", req.body);
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
      "customerModel",
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

/*************************** loginCustomer ***************************/
export const onLogin = async (req, res, next) => {
  const payload = req.body;
  console.log("payload==>", payload);
  let userData = await dbService.findOneRecord("customerModel", {
    email: payload.email.toLowerCase(),
    isDeleted: false,
  });
  console.log("userData==>", userData);
  if (!userData) throw new Error("Email not exists");

  let match = await decryptPassword(payload.password, userData.password);
  if (!match) throw new Error("Password Invalid");
  if (userData.isMailVerified == false) throw new Error("Please verify email");

  if (userData?.loginToken) {
    if (userData?.loginToken?.length >= 1) {
      let rr = await dbService.findOneAndUpdateRecord(
        "customerModel",
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
    "customerModel",
    { _id: userData._id },
    updateData,
    { new: true }
  );

  // res.setHeader("Access-Control-Expose-Headers", "token");
  // res.setHeader("token", data.loginToken[data.loginToken.length - 1].token);

  const options = {
    expires: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token", token, options);

  return {
    email: data.email,
    lastLogin: data.lastLoginDate,
    token: token,
  };
};

/*************************** getCustomer ***************************/
export const getCustomer = async (entry) => {
  console.log("entry=>", entry);
  let {
    user: { userId },
  } = entry;
  console.log("userId=>", userId);

  let contractorData = await dbService.findAllRecords("customerModel", {
    _id: userId,
  });

  return contractorData;
};

/*************************** updateCustomerPassword ***************************/
export const updateCustomerPassword = async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;

  let userData = await dbService.findOneRecord("customerModel", {
    _id: userId,
    isDeleted: false,
  });

  if (!userData) throw new Error("user not found!");

  let match = await decryptPassword(payload.oldPassword, userData.password);
  console.log("match->", match);
  if (!match) throw new Error("old Password is Invalid");

  if (req.body.newPassword !== req.body.confirmPassword) {
    throw new Error("new Password and confirm Password must be same!");
  }

  let password = await encryptpassword(req.body.newPassword);
  req.body.oldPassword = password;

  let project = await dbService.findOneAndUpdateRecord(
    "customerModel",
    { _id: userData._id },
    {
      password: password,
      updatedAt: Date(),
    },
    { new: true }
  );

  return project;
};

/*************************** forgotPassword ***************************/
export const forgotPassword = async (req, res) => {
  const payload = req.body;
  // const { userId } = req.user;

  let resetPasswordToken = await generateRandom();

  let userData = await dbService.findOneAndUpdateRecord(
    "customerModel",
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

  if (!userData) throw new Error("something wrong!");

  const resetPasswordUrl = `http://localhost:3000/${resetPasswordToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    let emailResponse = await sendEmail({
      email: userData.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    let emailSuccessMessage = `email send successfully ${payload.email}`;

    return {
      message: emailSuccessMessage,
    };
  } catch (error) {
    // let removeToken = await dbService.findOneAndUpdateRecord("customerModel",
    //   {
    //     _id: userId,
    //     email: payload.email,
    //   },
    //   {
    //     resetPasswordToken: undefined,
    //     resetPasswordExpire: undefined,
    //   },
    //   { new: true }
    // );
    // console.log("in catch");
    throw new Error("Email Not send! something wrong please try again.");
  }
};

/*************************** Reset Password from Link ***************************/
export const resetPassword = async (req, res) => {
  const payload = req.body;
  console.log(payload);

  if (payload.password !== payload.confirmPassword) {
    throw new Error("Password and confirm password must be same!", 400);
  }

  let userData = await dbService.findOneRecord("customerModel", {
    resetPasswordToken: payload.resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    isDeleted: false,
  });

  console.log("userData->", userData);

  if (!userData)
    throw new Error("Reset Password Token is invalid or has been expired", 400);

  let password = await encryptpassword(payload.password);

  let result = await dbService.findOneAndUpdateRecord(
    "customerModel",
    {
      _id: userData._id,
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

/*************************** UpdateCustomer ***************************/
export const updateCustomer = async (req, res) => {
  const payload = req.body;
  const { userId } = req.user;
  console.log(payload);
  console.log(userId);

  let userData = await dbService.findOneRecord("customerModel", {
    _id: userId,
    isDeleted: false,
  });

  if (!userData) throw new Error("user not found!");

  let project = await dbService.findOneAndUpdateRecord(
    "customerModel",
    { _id: userId },
    { ...payload, updatedAt: Date() },
    { runValidators: true, new: true }
  );

  return project;
};
