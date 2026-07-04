import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "./db";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function authenticateUser(username: string, password: string) {
  const [rows] = await pool.query(
    `SELECT u.*, s.* FROM users u LEFT JOIN students s ON u.id = s.userId WHERE u.username = ?`,
    [username],
  );
  const users = rows as any[];
  if (users.length === 0) return null;
  const user = users[0];
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) return null;

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: "7d",
  });
  return { user, token };
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
  } catch {
    return null;
  }
}
