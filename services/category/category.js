import dbService from "../../utilities/dbService";

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

    return project;
  }
};

// --------------- read all category ----------------
export const readCategory = async (req) => {
  let project = await dbService.findAllRecords("categoryModel", { isDelete: false });

  return project;
}

// -------------- update category --------------
export const updateCategory = async (req) => {
  const payload = req.body;

  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: payload._id,
    isDelete: false
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  let project = await dbService.findOneAndUpdateRecord("categoryModel",
    { _id: payload._id },
    payload,
    { runValidators: true, new: true }
  );

  return project;
}

// -------------- delete category -------------
export const deleteCategory = async (req) => {
  const { _id } = req.body;

  let categoryData = await dbService.findOneRecord("categoryModel", {
    _id: _id,
    isDelete: false
  });

  if (!categoryData) {
    throw new Error("Category Not Exists!");
  }

  let project = await dbService.findOneAndUpdateRecord("categoryModel",
    { _id: _id },
    { deleteAt: Date.now(), isDelete: true },
    { runValidators: true, new: true }
  );

  return project;
}