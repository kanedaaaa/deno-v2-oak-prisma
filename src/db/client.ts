import pg from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { users as userSchema } from "./schema.ts";

const { Pool } = pg;

export const db = drizzle({
  client: new Pool({
    connectionString: Deno.env.get("DATABASE_URL"),
  }),
  schema: { userSchema },
});
