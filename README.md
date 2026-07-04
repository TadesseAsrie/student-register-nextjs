This project is a production‑ready web application that allows educational institutions to manage student records efficiently. It provides a secure, role‑based interface with authentication, file uploads, and a modern dashboard.

Features
Common
 Secure JWT authentication with bcrypt password hashing

 Role‑based access control (Admin / Student)

 Fully responsive UI with CSS Modules (no Tailwind)

 Modern Next.js 15 App Router architecture

 Profile image upload (stored in public/uploads/)

 Student search, pagination, and sorting (admin only)

 Dashboard with statistics and recent students (admin)

Admin
✅ Login / Logout

✅ Register new students (with username & password)

✅ View, edit, delete students

✅ View student details

✅ Reset student password (optional)

✅ Change own password

✅ Update own profile (name, email, phone, photo)

Student
✅ Login / Logout

✅ View own profile (all fields)

✅ Update phone, address, profile picture

✅ Change password

Tech Stack
Layer	Technology
Framework	Next.js 15 (App Router)
Language	TypeScript
Database	MySQL (via mysql2 connection pool)
ORM	None (raw SQL)
Auth	JWT + bcrypt
Validation	Zod + React Hook Form
Styling	CSS Modules (Pure CSS)
HTTP Client	Axios
File Upload	Native Node.js fs
