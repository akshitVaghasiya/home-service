import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getWorker } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();


/**
 * @swagger
 * /api/v1/worker/getworker:
 *  post:
 *   tags: ["Worker"]
 *   summary: get Contractor information.
 *   description: api used for get Contractor information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get Contractor information.
 *        schema:
 *         type: object
 *         properties:
 *           page:
 *             type: string
 *           limit:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

router.post('/getworker',
    decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getWorker,
        isRequestValidateRequired: false,
        schemaValidate: {}
    }))



export default router;
