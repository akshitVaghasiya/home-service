import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateWorker } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

let multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './views/workerImages');
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

// const dataSchema = Joi.object({
//   firstName: Joi.string().required().label("firstName"),
//   lastName: Joi.string().required().label("lastName"),
//   address: Joi.object({
//     houseNo: Joi.string().required().label("houseNo"),
//     streetName: Joi.string().required().label("streetName"),
//     landMark: Joi.string().required().label("landMark"),
//     city: Joi.string().required().label("city"),
//     state: Joi.string().required().label("state"),
//     pinCode: Joi.string().length(6).required().label("pinCode"),
//   }),
//   email: Joi.string().required().label("email"),
//   phone: Joi.string().required().label("phone"),
// });

router.post('/updateworker',
  decodeJwtTokenFn,
  upload.single('avatar'),
  commonResolver.bind({
    modelService: updateWorker,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;