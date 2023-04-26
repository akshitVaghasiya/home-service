import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { onLogin } from "../../../../services/customer/customer";
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/login:
 *  post:
 *   tags: ["Customer"]
 *   summary: user login api
 *   description: api used to login users
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *   responses:
 *    "200":
 *     description: success
 */

const loginSchema = Joi.object({
    email: Joi.string()
        .required()
        .label("Email or username")
    , password: Joi.string()
        .required()
        .label("Password")
});

router.post('/login', commonResolver.bind({ modelService: onLogin, isRequestValidateRequired: true, schemaValidate: loginSchema }))


export default router;
