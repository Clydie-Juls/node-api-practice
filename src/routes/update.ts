import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { handleValidation } from "../middleware/validator";
import * as update from "../controllers/update";

const updateRouter = Router();

updateRouter.get("/", update.getAllUpdates);
updateRouter.get("/:id", handleValidation, update.getOneUpdate);
updateRouter.post(
  "/:productId",
  body("title").isString(),
  body("body").isString(),
  body("status")
    .optional()
    .isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"]),
  body("version").optional().isString(),
  handleValidation,
  update.createProduct
);
updateRouter.put(
  "/:id",
  body("title").optional().isString(),
  body("body").optional().isString(),
  body("status")
    .optional()
    .isIn(["IN_PROGRESS", "LIVE", "DEPRECATED", "ARCHIVED"]),
  body("version").optional().isString(),
  handleValidation,
  update.updateUpdate
);
updateRouter.delete("/:id", update.deleteUpdate);

export default updateRouter;
