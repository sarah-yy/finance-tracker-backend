import express from "express";
import { Account } from "@fin-tracker/controllers/index";
import { Auth, Types } from "@fin-tracker/util/index";

const router = express.Router();

const Routes: Types.SimpleMap<string> = {
  List: "/list",
  Register: "/register",
  Login: "/login",
  Refresh: "/refresh",
  Edit: "/edit",
};

router.get(Routes.List, Account.getAccounts);
router.post(Routes.Register, Account.registerAccount);
router.post(Routes.Login, Account.logIntoAccount);
router.post(Routes.Refresh, Auth.authenticateToken, Account.refreshAccessToken);
router.post(Routes.Edit, Auth.authenticateToken, Account.editAccount);

export default router;