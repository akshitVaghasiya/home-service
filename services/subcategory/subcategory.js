import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;
import { unlink } from 'node:fs';
const path = require('path');
const baseDir = path.resolve(process.cwd());

// --------------- add category ----------------
export const addSubCategory = async (req) => {
  const payload = req.body;
  console.log("payload->", payload);
  const { filename } = req.file;

  let subCategoryData = await dbService.findOneRecord("subCategoryModel", {
    subCategoryName: payload.subCategoryName
  });

  let data = {
    ...payload,
    ...{
      image: filename
    }
  }

  if (subCategoryData) {
    throw new Error("Subcategory Already Exists!");
  }

  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: payload.categoryId
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  let project = await dbService.createOneRecord("subCategoryModel", data);
  // console.log("project data =>", project);
  return project;
};

// --------------- read all category ----------------
export const readSubCategory = async (req) => {
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
          { subCategoryName: { $regex: postData.searchText, $options: "i" } },
        ],
      },
    };
  }
  if (postData.selectText) {
    where = {
      ...where,
      ...{
        categoryId: { $in: postData.selectText }
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

  let totalrecord = await dbService.recordsCount("subCategoryModel", where);
  let results = await dbService.findManyRecordsWithPagination("subCategoryModel",
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
export const updateSubCategory = async (req) => {
  let payload = req.body;
  const { filename } = req.file;
  const { id } = req.query;

  console.log("red-->", req);
  // return

  // category exist or not
  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: payload.categoryId
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  // same subcategory available or not
  let subCategoryData = await dbService.findOneRecord("subCategoryModel", {
    _id: id,
    isDeleted: false
  });

  if (!subCategoryData) {
    throw new Error("Subcategory Not Exists!");
  }

  if (filename) {
    payload = {
      ...payload,
      ...{
        image: filename
      }
    }

    if (subCategoryData.image) {
      const oldFileName = subCategoryData.image;
      const directoryPath = baseDir + "/views/subCategoryImages/";

      unlink(directoryPath + oldFileName, (err) => {
        if (err) {
          console.log("err-->", err)
        }
        console.log(`image successfully deleted ${oldFileName}`);
      });
    }
  }

  let project = await dbService.findOneAndUpdateRecord("subCategoryModel",
    { _id: id },
    payload,
    { runValidators: true, new: true }
  );

  return "sub category update successfully.";
}

// -------------- delete category -------------
export const deleteSubCategory = async (req) => {
  const { id } = req.body;
  console.log("req-->", req);

  let subCategoryData = await dbService.findOneRecord("subCategoryModel", {
    _id: ObjectId(id),
    isDeleted: false
  });

  if (!subCategoryData) {
    throw new Error("Subcategory Not Exists!");
  }

  let project = await dbService.findOneAndUpdateRecord("subCategoryModel",
    { _id: ObjectId(id) },
    { deleteAt: Date.now(), isDeleted: true },
    { runValidators: true, new: true }
  );

  return "Record Deleted Successfully!";
}

/********************** getSingleSubCategory **********************/
export const getSubCategoryWithId = async (req, res) => {
  let id = req.body.id;
  console.log("body", req.body);

  let serviceData = await dbService.findOneRecord("subCategoryModel",
    {
      _id: ObjectId(id),
      isDeleted: false,
    }
  );

  return serviceData;
}