import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { readSubCategory } from "../../../../services/subcategory/subcategory";
const router = new Router();


router.get('/all', commonResolver.bind({ modelService: readSubCategory, isRequestValidateRequired: false, schemaValidate: {} }))

export default router;