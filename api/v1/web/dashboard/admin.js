import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getAdminDashboard } from "../../../../services/dashboard/dashboard";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();


router.post('/admin',
    decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getAdminDashboard,
        isRequestValidateRequired: false,
        schemaValidate: {}
    }))

export default router;