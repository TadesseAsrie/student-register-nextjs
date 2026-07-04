import { NextRequest, NextResponse } from "next/server";
import { verifyToken, hashPassword } from "@/lib/auth";
import pool from "@/lib/db";
import { studentSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const searchParams = req.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  const offset = (page - 1) * limit;

  let whereClause = "";
  const whereParams: any[] = [];
  if (search) {
    whereClause = `
      WHERE s.firstName LIKE ? OR s.lastName LIKE ? OR s.studentId LIKE ? OR s.email LIKE ?
    `;
    const like = `%${search}%`;
    whereParams.push(like, like, like, like);
  }

  const orderClause = `ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}`;

  const countQuery = `SELECT COUNT(*) as total FROM students s ${whereClause}`;
  const [countRows] = await pool.query(countQuery, whereParams);
  const total = (countRows as any[])[0].total;

  const dataQuery = `
    SELECT s.*, u.username, u.role
    FROM students s
    JOIN users u ON s.userId = u.id
    ${whereClause}
    ${orderClause}
    LIMIT ? OFFSET ?
  `;
  const [dataRows] = await pool.query(dataQuery, [
    ...whereParams,
    limit,
    offset,
  ]);

  return NextResponse.json({
    data: dataRows,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  });
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = verifyToken(token);
  if (!payload || payload.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const validated = studentSchema.parse(body);

  // Check unique constraints
  const [existing] = await pool.query(
    `SELECT id FROM users WHERE username = ? OR id IN (SELECT userId FROM students WHERE email = ? OR studentId = ?)`,
    [validated.username, validated.email, validated.studentId],
  );
  if ((existing as any[]).length > 0) {
    return NextResponse.json(
      { error: "Username, email, or student ID already exists" },
      { status: 400 },
    );
  }

  const hashedPassword = await hashPassword(validated.password);

  const connection = await pool.getConnection();
  await connection.beginTransaction();

  try {
    const [userResult] = await connection.query(
      `INSERT INTO users (username, password, role) VALUES (?, ?, 'STUDENT')`,
      [validated.username, hashedPassword],
    );
    const userId = (userResult as any).insertId;

    await connection.query(
      `INSERT INTO students (
        studentId, firstName, middleName, lastName, gender, dob, email, phone,
        department, year, semester, address, userId
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        validated.studentId,
        validated.firstName,
        validated.middleName || null,
        validated.lastName,
        validated.gender,
        new Date(validated.dob),
        validated.email,
        validated.phone || null,
        validated.department,
        validated.year,
        validated.semester,
        validated.address || null,
        userId,
      ],
    );

    await connection.commit();
    connection.release();

    return NextResponse.json(
      { message: "Student registered" },
      { status: 201 },
    );
  } catch (error) {
    await connection.rollback();
    connection.release();
    throw error;
  }
}
