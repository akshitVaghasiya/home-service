/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */
import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getSingleEvent } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/worker/getsingleevent:
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

router.post('/getsingleevent',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getSingleEvent,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;
