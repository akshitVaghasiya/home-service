import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { forgotPassword } from "../../../../services/customer/customer";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/forgotpassword:
 *  post:
 *   tags: ["Customer"]
 *   summary: Save customer information.
 *   description: api used for create customer forgot password token information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save customer information.
 *        schema:
 *         type: object
 *         properties:
 *           email:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

const dataSchema = Joi.object({
  email: Joi.string().required().label("email"),
  from: Joi.string().label("from")
});

router.post('/forgotpassword', commonResolver.bind({ modelService: forgotPassword, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;
