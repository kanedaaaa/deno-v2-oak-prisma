import { Router } from "https://deno.land/x/oak/mod.ts";

import AuthController from "../controllers/auth.controller.ts";

const controller = new AuthController();
const authRouter = new Router();

authRouter
  .post("/signup", (ctx) => controller.signup(ctx))
  .post("/login", (ctx) => controller.login(ctx));

export default authRouter;
