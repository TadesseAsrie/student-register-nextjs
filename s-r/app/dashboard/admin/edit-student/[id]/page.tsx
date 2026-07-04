"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import StudentForm from "@/components/forms/StudentForm";
import styles from "./page.module.css";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

export default function EditStudentPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/students/${id}`)
      .then((res) => {
        setStudent(res.data);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Edit Student</h1>
          {loading ? <Spinner /> : <StudentForm initialData={student} isEdit />}
        </div>
      </div>
    </div>
  );
}
