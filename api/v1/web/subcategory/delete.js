import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { deleteSubCategory } from "../../../../services/subcategory/subcategory";
const router = new Router();

/**
 * @swagger
 * /api/v1/subcategory/delete:
 *  post:
 *   tags: ["SubCategory"]
 *   summary: Delete subcategory information.
 *   description: api used for Delete subcategory information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: Save subcategory information.
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
    modelService: deleteSubCategory,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema
  }));

export default router;