import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addCategory } from "../../../../services/category/category";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();

let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/categoryImages');
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
 * /api/v1/category/add:
 *  post:
 *   tags: ["Category"]
 *   summary: Save category information.
 *   description: api used for Save category information.
 *   consumes:
 *      - application/x-www-form-urlencoded
 *   parameters:
 *      - name: categoryName
 *        description: enter category Name.
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
  categoryName: Joi.string().required().label("categoryName"),
  // image: Joi.string().required().label("image"),
  description: Joi.string().required().label("description"),
  isActive: Joi.string().required().label("isActive"),
});

router.post('/add',
  // decodeJwtTokenFn,
  upload.single('image'),
  commonResolver.bind({
    modelService: addCategory,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;