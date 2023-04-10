import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getServiceWiseCart } from "../../../../services/cart/cart";
const router = new Router();

const dataSchema = Joi.object({
  serviceId: Joi.string().required().label("serviceId")
});


router.post('/getServiceWiseCart', commonResolver.bind({ modelService: getServiceWiseCart, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;