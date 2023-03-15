import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateCustomer } from "../../../../services/customer/customer";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

const dataSchema = Joi.object({
  firstName: Joi.string().required().label("firstName"),
  lastName: Joi.string().required().label("lastName"),
  address: Joi.object({
    houseNo: Joi.string().required().label("houseNo"),
    streetName: Joi.string().required().label("streetName"),
    landMark: Joi.string().required().label("landMark"),
    city: Joi.string().required().label("city"),
    state: Joi.string().required().label("state"),
    pinCode: Joi.string().length(6).required().label("pinCode"),
  }),
  email: Joi.string().required().label("email"),
  phone: Joi.string().required().label("phone"),
});

router.post('/updatecustomer', decodeJwtTokenFn, commonResolver.bind({ modelService: updateCustomer, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;