import bcrypt from "bcrypt";
import pool from "../lib/db";
import dotenv from "dotenv";

dotenv.config();

async function seed() {
  const hashed = await bcrypt.hash("admin123", 10);
  await pool.query(
    `INSERT INTO users (username, password, role) VALUES (?, ?, 'ADMIN') ON DUPLICATE KEY UPDATE password = VALUES(password)`,
    ["admin", hashed],
  );
  console.log(
    "✅ Admin user created/updated (username: admin, password: admin123).",
  );
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
