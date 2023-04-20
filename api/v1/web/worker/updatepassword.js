/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */
import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateWorkerPassword } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/updatepassword:
 *  post:
 *   tags: ["Customer"]
 *   summary: Save customer information.
 *   description: api used for update customer password information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save customer information.
 *        schema:
 *         type: object
 *         properties:
 *           oldPassword:
 *             type: string
 *           newPassword:
 *             type: string
 *           confirmPassword:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

const dataSchema = Joi.object({
  oldPassword: Joi.string().required().label("old Password"),
  newPassword: Joi.string().required().label("new Password"),
  confirmPassword: Joi.string().required().label("confirm Password"),
});

router.post('/updatepassword',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: updateWorkerPassword,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;
