"use client";

import StudentForm from "@/components/forms/StudentForm";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import styles from "./page.module.css";

export default function RegisterStudentPage() {
  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Register Student</h1>
          <StudentForm />
        </div>
      </div>
    </div>
  );
}
