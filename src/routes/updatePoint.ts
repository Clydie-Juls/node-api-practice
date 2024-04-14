import { Router, Request, Response } from "express";
import { body } from "express-validator";
import { handleValidation } from "../middleware/validator";
import * as updatePoint from "../controllers/updatePoints";

const updatePointRouter = Router();

updatePointRouter.get("/", updatePoint.getAllUpdatePoints);
updatePointRouter.get("/:id", updatePoint.getOneUpdatePoint);
updatePointRouter.post(
  "/:id",
  body("name").isString(),
  body("description").isString(),
  handleValidation,
  updatePoint.createProductPoint
);
updatePointRouter.put(
  "/:id",
  body("name").optional().isString(),
  body("description").optional().isString(),
  handleValidation,
  updatePoint.updateUpdatePoint
);
updatePointRouter.delete("/:id", updatePoint.deleteProductPoint);

export default updatePointRouter;
