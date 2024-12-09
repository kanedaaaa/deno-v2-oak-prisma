import { Client } from "https://deno.land/x/postgres/mod.ts";

const client = new Client({
  hostname: Deno.env.get("DB_HOST") || "localhost",
  database: Deno.env.get("DB_NAME") || "deno-db",
  user: Deno.env.get("DB_USER") || "root",
  password: Deno.env.get("DB_PASS") || "root",
  port: parseInt(Deno.env.get("DB_PORT") || "5432"),
});

export const connectDB = async () => {
  try {
    await client.connect();
    console.log("Database connected!");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
    throw err;
  }
};

export default client;
