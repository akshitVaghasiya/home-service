import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateWorker } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

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
  commonResolver.bind({
    modelService: updateWorker,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;