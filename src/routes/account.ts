import express from "express";
import { Account } from "@fin-tracker/controllers/index";

const router = express.Router();

router.get("/account/list", Account.getAccounts);
router.post("/register", Account.registerAccount);
router.post("/login", Account.logIntoAccount);

export default router;