"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import RecentStudents from "@/components/dashboard/RecentStudents";
import styles from "./page.module.css";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    male: 0,
    female: 0,
  });

  useEffect(() => {
    // Fetch stats – for demo, we only get total from students list
    fetch("/api/students?limit=1")
      .then((res) => res.json())
      .then((data) => {
        setStats({
          total: data.meta?.total || 0,
          active: 0,
          male: 0,
          female: 0,
        });
      })
      .catch(console.error);
  }, []);

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <div className={styles.statsGrid}>
            <StatsCard
              title="Total Students"
              value={stats.total}
              color="#667eea"
            />
            <StatsCard
              title="Active Students"
              value={stats.active}
              color="#48bb78"
            />
            <StatsCard title="Male" value={stats.male} color="#4299e1" />
            <StatsCard title="Female" value={stats.female} color="#ed64a6" />
          </div>
          <RecentStudents />
        </div>
      </div>
    </div>
  );
}
