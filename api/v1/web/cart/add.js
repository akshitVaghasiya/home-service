import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addToCart } from "../../../../services/cart/cart";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


const dataSchema = Joi.object({
  categoryName: Joi.string().required().label("categoryName"),
  subCategoryId: Joi.string().required().label("subCategoryId"),
  serviceId: Joi.string().required().label("serviceId"),
  quantity: Joi.number().required().label("quantity"),
});

router.post('/add',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: addToCart,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;