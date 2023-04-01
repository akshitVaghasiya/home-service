import dbService from "../../utilities/dbService";
const ObjectId = require("mongodb").ObjectID;

// --------------- add category ----------------
export const addSubCategory = async (req) => {
  const payload = req.body;
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
  let project = await dbService.findAllRecords("subCategoryModel", { isDeleted: false });

  return project;
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