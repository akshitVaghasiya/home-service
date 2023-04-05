import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { deleteCategory } from "../../../../services/category/category";
const router = new Router();

/**
 * @swagger
 * /api/v1/category/delete:
 *  post:
 *   tags: ["Category"]
 *   summary: delete category information.
 *   description: api used for delete category information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save category information.
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
  id: Joi.string().required().label("id"),
});

router.post('/delete',
  commonResolver.bind({
    modelService: deleteCategory,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }))

export default router;