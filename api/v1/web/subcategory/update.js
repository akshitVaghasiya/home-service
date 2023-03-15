import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { updateSubCategory } from "../../../../services/subcategory/subcategory";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/add:
 *  post:
 *   tags: ["Customer"]
 *   summary: Save customer information.
 *   description: api used for Save customer information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save customer information.
 *        schema:
 *         type: object
 *         properties:
 *           categoryName:
 *             type: string
 *           image:
 *             type: string
 *           description:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 */

const dataSchema = Joi.object({
  _id: Joi.string().required().label("_id"),
  subCategoryName: Joi.string().required().label("subCategoryName"),
  categoryId: Joi.string().required().label("categoryId"),
  image: Joi.string().required().label("image"),
  description: Joi.string().required().label("description")
});

router.post('/update', commonResolver.bind({ modelService: updateSubCategory, isRequestValidateRequired: true, schemaValidate: dataSchema }))

export default router;