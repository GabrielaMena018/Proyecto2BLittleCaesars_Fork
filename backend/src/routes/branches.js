import express from "express";
import branchescontoller from "../controllers/branchesController.js";
import { validateAuthCookie } from "../middlewares/authMiddleware.js";

//Router() nos ayuda a colocar los métodos
//que vamos a usar
const router = express.Router();

router
  .route("/")
  .get( branchescontoller.getbranches)
  .post(branchescontoller.insertBranches);



router
  .route("/:id")
  .put(branchescontoller.updateBranches)
  .delete(validateAuthCookie(["admin"]),branchescontoller.deleteBranches);

export default router;
