import { Router, type IRouter } from "express";
import healthRouter from "./health";
import geminiRouter from "./gemini/index.js";
import organizerRouter from "./gemini/organizer.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(geminiRouter);
router.use(organizerRouter);

export default router;
