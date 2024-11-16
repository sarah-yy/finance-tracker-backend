import express from "express";
import { getAccounts } from "../controllers/account";

const router = express.Router();

router.get("/account", getAccounts);

export default router;