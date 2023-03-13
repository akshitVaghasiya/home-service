import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { resetPassword } from "../../../../services/customer/customer";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/resetpassword:
 *  post:
 *   tags: ["Customer"]
 *   summary: Save customer information.
 *   description: api used for reset customer password information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save customer information.
 *        schema:
 *         type: object
 *         properties:
 *           resetPasswordToken:
 *             type: string
 *           password:
 *             type: string
 *           confirmPassword:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

const dataSchema = Joi.object({
    resetPasswordToken: Joi.string().required().label("resetPasswordToken"),
    password: Joi.string().required().label("password"),
    confirmPassword: Joi.string().required().label("confirmPassword")
});

router.post('/resetpassword', commonResolver.bind({ modelService: resetPassword, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;