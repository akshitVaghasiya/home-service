import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getWorkerDashboard } from "../../../../services/dashboard/dashboard";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();


router.post('/worker',
    decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getWorkerDashboard,
        isRequestValidateRequired: false,
        schemaValidate: {}
    }))

export default router;