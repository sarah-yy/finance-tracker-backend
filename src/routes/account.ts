import express from "express";
import { Account } from "@fin-tracker/controllers/index";
import { Auth } from "@fin-tracker/util/index";

const router = express.Router();

router.get("/list", Account.getAccounts);
router.post("/register", Account.registerAccount);
router.post("/login", Account.logIntoAccount);
router.post("/refresh", Auth.authenticateToken, Account.refreshAccessToken);

export default router;