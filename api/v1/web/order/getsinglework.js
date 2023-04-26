import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getSingleWork } from "../../../../services/order/order";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/worker/getsinglework:
 *  post:
 *   tags: ["Worker"]
 *   summary: Save worker information.
 *   description: api used for Save worker information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save worker information.
 *        schema:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

router.post('/getsinglework',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getSingleWork,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;
