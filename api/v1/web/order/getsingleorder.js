import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getSingleOrder } from "../../../../services/order/order";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


// const dataSchema = Joi.object({
//   categoryName: Joi.string().required().label("categoryName"),
//   subCategoryId: Joi.string().required().label("subCategoryId"),
//   serviceId: Joi.string().required().label("serviceId"),
//   quantity: Joi.number().required().label("quantity"),
// });

router.post('/getsingleorder',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getSingleOrder,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;