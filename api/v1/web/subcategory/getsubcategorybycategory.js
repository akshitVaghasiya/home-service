import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getSubCategoryByCategory } from "../../../../services/subcategory/subcategory";
const router = new Router();

const dataSchema = Joi.object({
  categoryName: Joi.string().required().label("categoryName")
});


router.post('/getSubCategoryByCategory', commonResolver.bind({ modelService: getSubCategoryByCategory, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;