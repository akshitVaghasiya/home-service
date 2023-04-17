import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { readContactUs } from "../../../../services/contactUs/contactUs";
const router = new Router();


router.post('/all',
    commonResolver.bind({
        modelService: readContactUs,
        isRequestValidateRequired: false,
        schemaValidate: {}
    }))

export default router;