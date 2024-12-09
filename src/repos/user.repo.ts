import client from "../config/db.ts";
import { User } from "../models/user.model.ts";
import { SignupPayload } from "../types/global.ts";

export const findUserById = async (id: number): Promise<User | null> => {
  const result = await client.queryObject<User>(
    `SELECT id, username, password, email, created_at, updated_at
     FROM users
     WHERE id = $1`,
    [id],
  );
  return result.rows[0] || null;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const result = await client.queryObject<User>(
    `SELECT id, username, password, email, created_at, updated_at
     FROM users
     WHERE email = $1`,
    [email],
  );

  return result.rows[0] || null;
};

export const findUserByUsername = async (
  username: string,
): Promise<User | null> => {
  const result = await client.queryObject<User>(
    `SELECT id, username, password, email, created_at, updated_at
     FROM users
     WHERE username = $1`,
    [username],
  );

  return result.rows[0] || null;
};

export const findUserByEmailOrUsername = async (
  email: string,
  username: string,
): Promise<{ option: string; user: User | null }> => {
  const userByEmail = await findUserByEmail(email);
  if (userByEmail) {
    return { option: "email", user: userByEmail };
  }

  const userByUsername = await findUserByUsername(username);
  if (userByUsername) {
    return { option: "username", user: userByUsername };
  }

  return { option: "", user: null };
};

export const createUser = async (
  payload: SignupPayload,
): Promise<User> => {
  const result = await client.queryObject<User>(
    `INSERT INTO users (username, password, email)
     VALUES ($1, $2, $3)
     RETURNING id, username, password, email, created_at, updated_at`,
    [payload.username, payload.password, payload.email],
  );

  return result.rows[0];
};
