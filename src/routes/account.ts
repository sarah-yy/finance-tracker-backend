import express from "express";
import { Account } from "@fin-tracker/controllers/index";
import { Auth, Types } from "@fin-tracker/util/index";

const router = express.Router();

const Routes: Types.SimpleMap<string> = {
  // List Accounts route
  List: "/list",

  // Create Account route
  Register: "/register",

  // Get and Refresh access tokens routes
  Login: "/login",
  Refresh: "/refresh",

  // Edit Account route
  Edit: "/edit",

  // Toggle delete routes
  Delete: "/delete",
  Reactivate: "/reactivate",
};

router.get(Routes.List, Auth.authenticateToken, Account.getAccounts);
router.post(Routes.Register, Account.registerAccount);
router.post(Routes.Login, Account.logIntoAccount);
router.post(Routes.Refresh, Auth.authenticateToken, Account.refreshAccessToken);
router.post(Routes.Edit, Auth.authenticateToken, Account.editAccount);
router.post(Routes.Delete, Auth.authenticateToken, Account.deleteAccount);
router.post(Routes.Delete, Auth.authenticateToken, Account.editAccount);
router.post(Routes.Reactivate, Auth.authenticateToken, Account.reactivateAccount);

export default router;