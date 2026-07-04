import { NextRequest, NextResponse } from "next/server";
import { verifyToken, verifyPassword, hashPassword } from "@/lib/auth";
import pool from "@/lib/db";
import { changePasswordSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const body = await req.json();
  const validated = changePasswordSchema.parse(body);

  const [rows] = await pool.query(`SELECT password FROM users WHERE id = ?`, [
    payload.userId,
  ]);
  const users = rows as any[];
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isCurrentValid = await verifyPassword(
    validated.currentPassword,
    users[0].password,
  );
  if (!isCurrentValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  const hashed = await hashPassword(validated.newPassword);
  await pool.query(`UPDATE users SET password = ? WHERE id = ?`, [
    hashed,
    payload.userId,
  ]);

  return NextResponse.json({ message: "Password updated successfully" });
}
