import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());

// --------------- add category ----------------
export const addCategory = async (req) => {
  const payload = req.body;
  const { filename } = req.file;

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
          { categoryName: { $regex: postData.searchText, $options: "i" } },
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

  let totalrecord = await dbService.recordsCount("categoryModel", where);
  let results = await dbService.findManyRecordsWithPagination("categoryModel",
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

// -------------- update category --------------
export const updateCategory = async (req) => {
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