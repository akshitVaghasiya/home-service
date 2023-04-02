import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addSubCategory } from "../../../../services/subcategory/subcategory";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();

let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/subCategoryImages');
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
    // cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    // cb(new Error("File format should be CSV"), false); // if validation failed then generate error
    return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
};
let upload = multer({ storage: storage, fileFilter: fileFilter });

/**
 * @swagger
 * /api/v1/subcategory/add:
 *  post:
 *   tags: ["SubCategory"]
 *   summary: Save Sub category information.
 *   description: api used for Save Sub category information.
 *   consumes:
 *      - application/x-www-form-urlencoded
 *   parameters:
 *      - name: categoryId
 *        description: enter sub category Id.
 *        in: formData
 *        type: string
 *      - name: subCategoryName
 *        description: enter sub Category Name.
 *        in: formData
 *        type: string
 *      - name: image
 *        description: save category image information.
 *        in: formData
 *        type: file
 *      - name: description
 *        description: enter description.
 *        in: formData
 *        type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

const dataSchema = Joi.object({
  categoryId: Joi.string().required().label("categoryId"),
  subCategoryName: Joi.string().required().label("subCategoryName"),
  // image: Joi.string().required().label("image"),
  description: Joi.string().required().label("description")
});

router.post('/add',
  // decodeJwtTokenFn,
  upload.single('image'),
  commonResolver.bind({
    modelService: addSubCategory,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))
export default router;