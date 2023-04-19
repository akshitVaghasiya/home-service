import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getReviewByService } from "../../../../services/review/review";
const router = new Router();

const dataSchema = Joi.object({
  serviceId: Joi.string().required().label("serviceId")
});


router.post('/getreviewbyservice', commonResolver.bind({ modelService: getReviewByService, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;