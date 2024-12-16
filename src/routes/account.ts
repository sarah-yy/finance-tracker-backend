import express from "express";
import { Account } from "@fin-tracker/controllers";

const router = express.Router();

router.get("/account/list", Account.getAccounts);
router.post("/register", Account.registerAccount);


export default router;