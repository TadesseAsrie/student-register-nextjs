import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const [rows] = await pool.query(
    `SELECT u.*, s.* FROM users u LEFT JOIN students s ON u.id = s.userId WHERE u.id = ?`,
    [payload.userId],
  );
  const users = rows as any[];
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(users[0]);
}

export async function PUT(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const body = await req.json();
  const validated = profileUpdateSchema.parse(body);

  const [userRows] = await pool.query(`SELECT role FROM users WHERE id = ?`, [
    payload.userId,
  ]);
  const users = userRows as any[];
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (users[0].role === "STUDENT") {
    const fields: string[] = [];
    const values: any[] = [];
    if (validated.firstName) {
      fields.push("firstName = ?");
      values.push(validated.firstName);
    }
    if (validated.lastName) {
      fields.push("lastName = ?");
      values.push(validated.lastName);
    }
    if (validated.email) {
      fields.push("email = ?");
      values.push(validated.email);
    }
    if (validated.phone) {
      fields.push("phone = ?");
      values.push(validated.phone);
    }
    if (validated.address) {
      fields.push("address = ?");
      values.push(validated.address);
    }
    if (fields.length > 0) {
      values.push(payload.userId);
      await pool.query(
        `UPDATE students SET ${fields.join(", ")} WHERE userId = ?`,
        values,
      );
    }
  } else {
    if (validated.username) {
      await pool.query(`UPDATE users SET username = ? WHERE id = ?`, [
        validated.username,
        payload.userId,
      ]);
    }
  }

  return NextResponse.json({ message: "Profile updated" });
}
