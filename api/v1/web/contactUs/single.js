import { Joi } from '../../../../utilities/schemaValidate'
import { Router } from 'express';
import commonResolver from '../../../../utilities/commonResolver'
import { getSingleContactUs } from "../../../../services/contactUs/contactUs";
import { decodeJwtTokenFn } from '../../../../utilities/universal';
const router = new Router();

/**
 * @swagger
 * /api/v1/contactUs/getcontactUswithid:
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

router.post('/getcontactUswithid',
    decodeJwtTokenFn,
    commonResolver.bind({
        modelService: getSingleContactUs,
        isRequestValidateRequired: false,
        schemaValidate: dataSchema
    }))
export default router;
