import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload)
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("image") as File;
  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }

  const ext = path.extname(file.name);
  const filename = `${randomUUID()}${ext}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filePath = path.join(uploadDir, filename);
  await writeFile(filePath, buffer);

  const [userRows] = await pool.query(`SELECT role FROM users WHERE id = ?`, [
    payload.userId,
  ]);
  const users = userRows as any[];
  if (users.length === 0) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (users[0].role === "STUDENT") {
    await pool.query(`UPDATE students SET image = ? WHERE userId = ?`, [
      filename,
      payload.userId,
    ]);
  } else {
    await pool.query(`UPDATE users SET image = ? WHERE id = ?`, [
      filename,
      payload.userId,
    ]);
  }

  return NextResponse.json({ message: "Upload successful", filename });
}
