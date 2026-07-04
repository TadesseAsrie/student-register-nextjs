import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  waitForConnections: true,
});

// Initialize tables and indexes on first connection
(async function init() {
  let connection;
  try {
    connection = await pool.getConnection();
    console.log("✅ Connected to MySQL database successfully.");

    // Create tables
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('ADMIN', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
        image VARCHAR(255) NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        studentId VARCHAR(50) UNIQUE NOT NULL,
        firstName VARCHAR(100) NOT NULL,
        middleName VARCHAR(100) NULL,
        lastName VARCHAR(100) NOT NULL,
        gender ENUM('MALE', 'FEMALE', 'OTHER') NOT NULL,
        dob DATE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20) NOT NULL,
        department VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        semester INT NOT NULL,
        address TEXT NOT NULL,
        image VARCHAR(255) NULL,
        userId INT UNIQUE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Indexes for performance
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_student_search_names ON students(lastName, firstName);
    `);
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_student_academic_tier ON students(department, year, semester);
    `);
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_student_id_lookup ON students(studentId);
    `);
    await connection.query(`
      CREATE INDEX IF NOT EXISTS idx_user_role_lookup ON users(role);
    `);

    console.log("🚀 Database schema and indexes verified.");
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
  } finally {
    if (connection) connection.release();
  }
})();

export default pool;
