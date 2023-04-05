import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getServiceBySubCategory } from "../../../../services/service/service";
const router = new Router();

const dataSchema = Joi.object({
  subCategoryName: Joi.string().required().label("subCategoryName")
});


router.post('/getServiceBySubCategory', commonResolver.bind({ modelService: getServiceBySubCategory, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;