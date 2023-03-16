/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */
import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateService } from "../../../../services/service/service";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();
let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/serviceImages');
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
 * /api/v1/service/edit:
 *  post:
 *   tags: ["Service"]
 *   summary: Update service information.
 *   description: api used for update service information.
 *   consumes:
 *      - application/x-www-form-urlencoded
 *   parameters:
 *      - in: query
 *        name: id
 *        schema:
 *          type: string
 *        description: service Id
 *      - name: subcategoryId
 *        description: enter sub category id.
 *        in: formData
 *        type: string
 *      - name: serviceName
 *        description: enter serviceName.
 *        in: formData
 *        type: string
 *      - name: duration
 *        description: enter duration.
 *        in: formData
 *        type: number
 *      - name: image
 *        description: save service image information.
 *        in: formData
 *        type: file
 *      - name: price
 *        description: enter price.
 *        in: formData
 *        type: number
 *      - name: description
 *        description: enter service description.
 *        in: formData
 *        type: string
 *      - name: included
 *        description: enter included description.
 *        in: formData
 *        type: array
 *        items:
 *          type: string    
 *      - name: excluded
 *        description: enter excluded description.
 *        in: formData
 *        type: array
 *        items:
 *          type: string    
 *      - name: queryQue
 *        description: enter excluded description.
 *        in: formData
 *        type: array
 *        items:
 *          type: object
 *          properties:
 *            question:
 *              type: string
 *            answer:
 *                   type: string    
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

const dataSchema = Joi.object({
  subcategoryId: Joi.string().required().label("subcategoryId"),
  serviceName: Joi.string().required().label("serviceName"),
  // serviceCharge: Joi.number().required().label("serviceCharge"),
  // image: Joi.string().required().label("image"),
  duration: Joi.string().required().label("duration"),
  price: Joi.string().required().label("price"),
  description: Joi.string().required().label("description"),
  included: Joi.string().required().label("included field"),
  excluded: Joi.string().required().label("excluded field"),
  // included: Joi.array().items(Joi.string()).required().label("included field"),
  // excluded: Joi.array().items(Joi.string()).required().label("excluded field"),
  queryQue: Joi.string().required().label("queryQue field"),
  // query: Joi.array().items(
  //   Joi.object({
  //     question: Joi.string().required().label("question"),
  //     answer: Joi.string().required().label("answer"),
  //   })
  // ),
});

router.post('/edit',
  decodeJwtTokenFn,
  upload.single('image'),
  commonResolver.bind({
    modelService: updateService,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;
