import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getRequest } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/worker/getrequest:
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
 *           name:
 *             type: string
 *           gender:
 *             type: string
 *           address:
 *             type: object
 *             properties:
 *               houseNo:
 *                 type: string
 *               streetName:
 *                 type: string
 *               landMark:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               pinCode:
 *                 type: string
 *           email:
 *             type: string
 *           phone:
 *             type: string
 *           password:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

router.post('/getrequest',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getRequest,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;
