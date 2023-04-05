import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { readCategory } from "../../../../services/category/category";
const router = new Router();


router.post('/all', commonResolver.bind({ modelService: readCategory, isRequestValidateRequired: false, schemaValidate: {} }))

export default router;