import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getService } from "../../../../services/service/service";
const router = new Router();

/**
 * @swagger
 * /api/v1/service/all:
 *  post:
 *   tags: ["Service"]
 *   summary: get Service information.
 *   description: api used for get Service information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get Service information.
 *        schema:
 *         type: object
 *         properties:
 *           subCategoryId:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

router.post('/all',
    commonResolver.bind({
        modelService: getService,
        isRequestValidateRequired: false,
        schemaValidate: {}
    }))

export default router;