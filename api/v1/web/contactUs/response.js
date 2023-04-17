import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { responseContactUs } from "../../../../services/contactUs/contactUs";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

const dataSchema = Joi.object({
  // _id: Joi.string().required().label("_id"),
  categoryName: Joi.string().required().label("categoryName"),
  // image: Joi.string().required().label("image"),
  description: Joi.string().required().label("description"),
  isActive: Joi.string().required().label("isActive"),
});

router.post('/responsecontactUs',
  commonResolver.bind({
    modelService: responseContactUs,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;