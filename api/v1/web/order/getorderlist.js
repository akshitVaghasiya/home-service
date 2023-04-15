import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getOrderList } from "../../../../services/order/order";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


// const dataSchema = Joi.object({
//   categoryName: Joi.string().required().label("categoryName"),
//   subCategoryId: Joi.string().required().label("subCategoryId"),
//   serviceId: Joi.string().required().label("serviceId"),
//   quantity: Joi.number().required().label("quantity"),
// });

router.post('/getorderlist',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getOrderList,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;