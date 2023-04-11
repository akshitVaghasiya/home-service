import { Joi } from "../../../../utilities/schemaValidate";
import { Router } from "express";
import commonResolver from "../../../../utilities/commonResolver";
import { getCategoryWiseCart } from "../../../../services/cart/cart";
import { decodeJwtTokenFn } from "../../../../utilities/universal";
const router = new Router();

const dataSchema = Joi.object({
  categoryName: Joi.string().required().label("categoryName"),
});

router.post(
  "/getCategoryWiseCart",
  decodeJwtTokenFn,
  commonResolver.bind({
    modelService: getCategoryWiseCart,
    isRequestValidateRequired: true,
    schemaValidate: dataSchema,
  })
);

export default router;
