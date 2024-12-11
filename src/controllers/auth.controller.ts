import { Context } from "https://deno.land/x/oak/mod.ts";

import AuthService from "../services/auth.service.ts";
import { SignupPayload } from "../types/global.ts";
import { LoginPayload } from "../types/global.ts";

class AuthController {
  constructor(private authService = new AuthService()) {}

  public async signup(ctx: Context) {
    const payload = await ctx.request.body.json() as SignupPayload;
    const response = await this.authService.signup(payload);
    ctx.response.body = { message: response };
  }

  public async login(ctx: Context) {
    const payload = await ctx.request.body.json() as LoginPayload;
    const response = await this.authService.login(payload);
    ctx.response.body = { message: "ok, but data is dev only", data: response };
  }
}

export default AuthController;
