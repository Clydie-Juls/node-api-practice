import express, { Router, Request, Response, NextFunction } from "express";
import { protect } from "./controllers/auth";
import authRouter from "./routes/auth";
import productRouter from "./routes/product";
import updateRouter from "./routes/update";
import updatePointRouter from "./routes/updatePoint";
import * as dotenv from "dotenv";
import config from "./config";
dotenv.config();

const app = express();
const apiRouter = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

apiRouter.use("/product", productRouter);
apiRouter.use("/update", updateRouter);
apiRouter.use("/updatepoint", updatePointRouter);

app.use("/api", protect, apiRouter);
app.use(authRouter);

app.use((err, req: Request, res: Response, next: NextFunction) => {
  if (err.type === "input") {
    res.status(400).json({ message: "Bad input" });
  } else if (err.type === "auth") {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(config.port, () => {
  console.log(`Never gonna give you up in http://localhost:${config.port}`);
});
