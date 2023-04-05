import { Joi } from '../../../../utilities/schemaValidate';
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { readSubCategory } from "../../../../services/subcategory/subcategory";
const router = new Router();

/**
 * @swagger
 * /api/v1/subcategory/all:
 *  post:
 *   tags: ["SubCategory"]
 *   summary: get subcategory information.
 *   description: api used for get subcategory information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get Service information.
 *        schema:
 *         type: object
 *         properties:
 *           page:
 *             type: string
 *           limit:
 *             type: string
 *           sortBy:
 *             type: string
 *           sortMode:
 *             type: string
 *           searchText:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

router.post('/all', commonResolver.bind({
    modelService: readSubCategory,
    isRequestValidateRequired: false,
    schemaValidate: {}
}))

export default router;