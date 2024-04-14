import { Router, Request, Response } from "express";

const userRouter = Router();

userRouter.get("/", (req: Request, res: Response) => {});
userRouter.get("/:id", (req: Request, res: Response) => {});
userRouter.post("/", (req: Request, res: Response) => {});
userRouter.put("/:id", (req: Request, res: Response) => {});
userRouter.delete("/:id", (req: Request, res: Response) => {});

export default userRouter;
