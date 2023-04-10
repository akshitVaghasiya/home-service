/**
 * This is Contain Save router/api.
 * @author Sandip Vaghasiya
 *
 */

import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getCustomerWithId } from "../../../../services/customer/customer";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();

/**
 * @swagger
 * /api/v1/customer/getcustomerwithid:
 *  post:
 *   tags: ["SubCategory"]
 *   summary: get Service information.
 *   description: api used for get subcategory information.
 *   parameters:
 *      - in: body
 *        name: lead
 *        description: get subcategory information.
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *   responses:
 *    "200":
 *     description: success
 *    "400":
 *     description: fail
 *   security:
 *      - bearerAuth: [] 
 */

const dataSchema = Joi.object({
    id: Joi.string().required().label("subCategory id"),
});

router.post('/getcustomerwithid',
    decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getCustomerWithId,
        isRequestValidateRequired: false,
        schemaValidate: dataSchema
    }))
export default router;
