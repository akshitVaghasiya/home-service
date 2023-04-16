import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getReview } from "../../../../services/review/review";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


const dataSchema = Joi.object({
  reviewId: Joi.string().required().label("reviewId"),
});

router.post('/getreview',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getReview,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;