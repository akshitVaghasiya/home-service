import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { addContactUs } from "../../../../services/contactUs/contactUs";
import { decodeJwtTokenFn } from "../../../../utilities/universal";

const router = new Router();

/**
 * @swagger
 * /api/v1/contactUs/add:
 *  post:
 *   tags: ["ContactUs"]
 *   summary: Save ContactUs information.
 *   description: api used for Save ContactUs information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save ContactUs information.
 *        schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           email:
 *             type: string
 *           message:
 *             type: string
 *           contactType:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

const dataSchema = Joi.object({
  categoryName: Joi.string().required().label("categoryName"),
  // image: Joi.string().required().label("image"),
  description: Joi.string().required().label("description"),
  isActive: Joi.string().required().label("isActive"),
});

router.post('/add',
  commonResolver.bind({
    modelService: addContactUs,
    isRequestValidateRequired: false,
    schemaValidate: {}
  }))

export default router;