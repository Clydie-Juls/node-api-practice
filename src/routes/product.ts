import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { handleValidation } from "../middleware/validator";
import * as product from "../controllers/product";

const productRouter = Router();

productRouter.get("/", product.getAllProducts);
productRouter.get("/:id", product.getOneProduct);
productRouter.post(
  "/",
  body("name").isString(),
  handleValidation,
  product.createProduct
);
productRouter.put(
  "/:id",
  body("name").isString(),
  handleValidation,
  product.updateProduct
);
productRouter.delete("/:id", product.deleteProduct);

export default productRouter;
