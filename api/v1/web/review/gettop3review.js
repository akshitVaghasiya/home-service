import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getTop3Review } from "../../../../services/review/review";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();


const dataSchema = Joi.object({
  reviewId: Joi.string().required().label("reviewId"),
});

router.post('/gettop3review',
  // decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getTop3Review,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;