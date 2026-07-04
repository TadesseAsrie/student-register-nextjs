import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import pool from "@/lib/db";
import { updateStudentSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [rows] = await pool.query(
    `SELECT s.*, u.username FROM students s JOIN users u ON s.userId = u.id WHERE s.id = ?`,
    [parseInt(params.id)],
  );
  const students = rows as any[];
  if (students.length === 0) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  return NextResponse.json(students[0]);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const validated = updateStudentSchema.parse(body);

  const fields: string[] = [];
  const values: any[] = [];
  if (validated.firstName) {
    fields.push("firstName = ?");
    values.push(validated.firstName);
  }
  if (validated.middleName !== undefined) {
    fields.push("middleName = ?");
    values.push(validated.middleName);
  }
  if (validated.lastName) {
    fields.push("lastName = ?");
    values.push(validated.lastName);
  }
  if (validated.gender) {
    fields.push("gender = ?");
    values.push(validated.gender);
  }
  if (validated.dob) {
    fields.push("dob = ?");
    values.push(new Date(validated.dob));
  }
  if (validated.email) {
    fields.push("email = ?");
    values.push(validated.email);
  }
  if (validated.phone !== undefined) {
    fields.push("phone = ?");
    values.push(validated.phone);
  }
  if (validated.department) {
    fields.push("department = ?");
    values.push(validated.department);
  }
  if (validated.year) {
    fields.push("year = ?");
    values.push(validated.year);
  }
  if (validated.semester) {
    fields.push("semester = ?");
    values.push(validated.semester);
  }
  if (validated.address !== undefined) {
    fields.push("address = ?");
    values.push(validated.address);
  }

  if (fields.length === 0) {
    return NextResponse.json(
      { message: "No fields to update" },
      { status: 200 },
    );
  }

  values.push(parseInt(params.id));
  await pool.query(
    `UPDATE students SET ${fields.join(", ")} WHERE id = ?`,
    values,
  );

  return NextResponse.json({ message: "Student updated" });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [rows] = await pool.query(`SELECT userId FROM students WHERE id = ?`, [
    parseInt(params.id),
  ]);
  const students = rows as any[];
  if (students.length === 0) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }
  const userId = students[0].userId;

  await pool.query(`DELETE FROM users WHERE id = ?`, [userId]);

  return NextResponse.json({ message: "Student deleted" });
}
