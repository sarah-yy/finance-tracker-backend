import { Router } from "express";
import accountRoutes from "./account";

const router = Router();

router.use(accountRoutes);

export default router;
