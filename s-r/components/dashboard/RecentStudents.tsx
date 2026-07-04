"use client";

import { useEffect, useState } from "react";
import styles from "./RecentStudents.module.css";
import axios from "axios";

export default function RecentStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    axios
      .get("/api/students?limit=5&sortBy=createdAt&sortOrder=desc")
      .then((res) => {
        setStudents(res.data.data);
      });
  }, []);

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Recent Students</h3>
      <ul className={styles.list}>
        {students.map((s: any) => (
          <li key={s.id} className={styles.item}>
            {s.firstName} {s.lastName} - {s.studentId}
          </li>
        ))}
        {students.length === 0 && <li>No recent students</li>}
      </ul>
    </div>
  );
}
