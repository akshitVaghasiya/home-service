import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addReview } from "../../../../services/review/review";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


const dataSchema = Joi.object({
  _id: Joi.string().required().label("_id"),
  serviceId: Joi.string().required().label("serviceId"),
  orderId: Joi.string().required().label("orderId"),
  rating: Joi.number().required().label("rating"),
  description: Joi.string().required().label("description"),
});

router.post('/add',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: addReview,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;