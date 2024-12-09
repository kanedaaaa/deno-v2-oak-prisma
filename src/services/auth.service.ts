import { compare, hash } from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt/mod.ts";

import { createUser } from "../repos/user.repo.ts";
import { findUserByEmailOrUsername } from "../repos/user.repo.ts";
import { LoginPayload, SignupPayload } from "../types/global.ts";
import CustomError from "../utils/customError.ts";
import { importSecretKey } from "../utils/jwt.ts";

class AuthService {
  public async signup(payload: SignupPayload) {
    const exists = await findUserByEmailOrUsername(
      payload.email,
      payload.username,
    );

    if (exists.user) {
      throw new CustomError(
        undefined,
        `${exists.option} is already taken`,
        409,
      );
    }

    payload.password = await hash(payload.password);

    try {
      const user = await createUser(payload);
      return user.email;
    } catch (err: unknown) {
      throw new CustomError(err);
    }
  }

  public async login(payload: LoginPayload) {
    const dbResponse = await findUserByEmailOrUsername(
      payload.email,
      payload.username,
    );

    if (!dbResponse.user) {
      throw new CustomError(undefined, "user couldn't be found", 404);
    }

    if (!(await compare(payload.password, dbResponse.user.password_hash))) {
      throw new CustomError(undefined, "wrong password provided", 401);
    }

    try {
      const jwt = await create(
        {
          alg: "HS256",
          type: "JWT",
        },
        {
          id: dbResponse.user.id,
          exp: getNumericDate(60 * 60), // 1h
        },
        await importSecretKey(),
      );

      return jwt;
    } catch (err: unknown) {
      throw new CustomError(err);
    }
  }
}

export default AuthService;
