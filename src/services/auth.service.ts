import { compare, hash } from "https://deno.land/x/bcrypt/mod.ts";
import { create, getNumericDate } from "https://deno.land/x/djwt/mod.ts";

import { eq, or } from "drizzle-orm/expressions";

import { LoginPayload, SignupPayload } from "../types/global.ts";
import CustomError from "../utils/customError.ts";
import { importSecretKey } from "../utils/jwt.ts";
import { db } from "../db/client.ts";
import { users } from "../db/schema.ts";

class AuthService {
  public async signup(payload: SignupPayload) {
    const exists = await this.checkIfExists(payload.email, payload.username);

    if (exists.user) {
      const fieldsTaken = exists.foundFields.join(" and ");
      throw new CustomError(
        undefined,
        `${fieldsTaken} ${
          exists.foundFields.length > 1 ? "are" : "is"
        } already taken`,
        409,
      );
    }

    payload.password = await hash(payload.password);

    try {
      const user = await db.insert(users).values(payload).returning();
      return user[0].email;
    } catch (err: any) {
      throw new CustomError(err);
    }
  }

  public async login(payload: LoginPayload) {
    const user = await db.select().from(users).where(
      eq(users.email, payload.email),
    );

    if (!user[0]) {
      throw new CustomError(undefined, "user wasn't found", 404);
    }

    if (!(await compare(payload.password, user[0].password))) {
      throw new CustomError(undefined, "wrong password provided", 401);
    }

    try {
      const jwt = await create(
        {
          alg: "HS256",
          type: "JWT",
        },
        {
          id: user[0].id,
          exp: getNumericDate(60 * 60), // 1h
        },
        await importSecretKey(),
      );

      return jwt;
    } catch (err: any) {
      throw new CustomError(err);
    }
  }

  private async checkIfExists(email: string, username: string) {
    const user = await db.select().from(users).where(
      or(eq(users.email, email), eq(users.username, username)),
    ).limit(1);

    if (!user.length) {
      return { user: null, foundFields: [] };
    }

    const foundFields: string[] = [];

    if (user[0].email === email) {
      foundFields.push("email");
    }

    if (user[0].username === username) {
      foundFields.push("username");
    }

    return { user: user[0], foundFields };
  }
}

export default AuthService;
