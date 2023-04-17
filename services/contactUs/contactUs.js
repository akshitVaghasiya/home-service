import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());
import { sendEmail } from "../../utilities/sendEmail";


// --------------- add category ----------------
export const addContactUs = async (req) => {
  let payload = req.body;

  console.log("req------>", req);

  let project = await dbService.createOneRecord("contactUsModel", payload);

  return {
    data: project,
    message: "response send successfully..."
  };

};

// --------------- read all category ----------------
export const readContactUs = async (req) => {
  let postData = req.body;
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
          // { categoryName: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
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
  console.log("where=>", where);

  let totalrecord = await dbService.recordsCount("contactUsModel", where);
  let results = await dbService.findManyRecordsWithPagination("contactUsModel",
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

/*************************** singele ContactUs ***************************/
export const getSingleContactUs = async (req, res) => {
  let payload = req.body;


  let contactData = await dbService.findOneRecord("contactUsModel", {
    _id: ObjectId(payload.id),
  });

  if (!contactData) throw new Error("data not found!");

  return contactData;
};

/*************************** response ContactUs ***************************/
export const responseContactUs = async (req, res) => {
  let payload = req.body;
  let { id } = req.query;

  console.log("req------->", req);

  let contactData = await dbService.findOneAndUpdateRecord("contactUsModel",
    {
      _id: ObjectId(id),
    },
    payload,
    { new: true }
  );

  if (!contactData) throw new Error("data not found!");

  try {
    let emailResponse = await sendEmail({
      email: contactData.email,
      subject: contactData.title,
      message: contactData.response,
    });
    console.log("contactData----------->", contactData);
    console.log("contactData.email----------->", contactData.email);
    console.log("contactData.title----------->", contactData.title);
    console.log("contactData.response----------->", contactData.response);

    let emailSuccessMessage = `email send successfully ${contactData.email}`;

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
