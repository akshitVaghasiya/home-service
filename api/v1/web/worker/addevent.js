/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */
import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addEvent } from "../../../../services/worker/worker";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/worker/addevent:
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

const dataSchema = Joi.object({
  firstName: Joi.string().required().label("firstName"),
  lastName: Joi.string().required().label("lastName"),
  // address: Joi.object({
  //   houseNo: Joi.string().required().label("houseNo"),
  //   streetName: Joi.string().required().label("streetName"),
  //   landMark: Joi.string().required().label("landMark"),
  //   city: Joi.string().required().label("city"),
  //   state: Joi.string().required().label("state"),
  //   pinCode: Joi.string().length(6).required().label("pinCode"),
  // }),
  email: Joi.string().required().label("email"),
  phone: Joi.string().required().label("phone"),
  password: Joi.string().required().label("password"),
});

router.post('/addevent',
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: addEvent,
    isRequestValidateRequired: false,
    schemaValidate: dataSchema
  }))

export default router;
