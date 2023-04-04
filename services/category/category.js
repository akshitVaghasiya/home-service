import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());

// --------------- add category ----------------
export const addCategory = async (req) => {
  const payload = req.body;
  const { filename } = req.file;
  console.log("req.body->", req.body);
  console.log("req.file->", req.file);
  console.log("req->", req);

  let categoryData = await dbService.findOneRecord("categoryModel", {
    categoryName: payload.categoryName
  });

  let data = {
    ...payload,
    ...{
      image: filename
    }
  }

  if (categoryData) {
    throw new Error("Category Already Exists!");
  } else {

    let project = await dbService.createOneRecord("categoryModel", data);
    // console.log("project data =>", project);

    return {
      data: project,
      message: "new category added successfully."
    };
  }
};

// --------------- read all category ----------------
export const readCategory = async (req) => {
  let project = await dbService.findAllRecords("categoryModel", { isDeleted: false });

  return project;
}

// -------------- update category --------------
export const updateCategory = async (req) => {
  console.log("req->", req);
  const { id } = req.query;
  let payload = req.body;
  const { filename } = req.file;

  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: ObjectId(id),
    isDeleted: false
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  if (filename) {
    payload = {
      ...payload,
      ...{
        image: filename,
      }
    };

    if (categoryData.image) {
      const oldFileName = categoryData.image;
      const directoryPath = baseDir + "/views/categoryImages/";
      unlink(directoryPath + oldFileName, (err) => {
        if (err) {
          console.log("err-->", err)
        }
        console.log(`image successfully deleted ${oldFileName}`);
      });
    }
  }

  let project = await dbService.findOneAndUpdateRecord("categoryModel",
    { _id: ObjectId(id) },
    payload,
    { runValidators: true, new: true }
  );

  return "category updated successfully.";
}

// -------------- delete category -------------
export const deleteCategory = async (req) => {
  const { id } = req.body;

  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: ObjectId(id),
    isDeleted: false
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  let project = await dbService.findOneAndUpdateRecord("categoryModel",
    { _id: ObjectId(id) },
    { deleteAt: Date.now(), isDeleted: true },
    { runValidators: true, new: true }
  );

  return "sub category deleted successfully.";
}