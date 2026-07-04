"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import Table from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Spinner from "@/components/ui/Spinner";

export default function StudentsPage() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/students", {
        params: { page, limit: 10, search, sortBy, sortOrder },
      });
      setStudents(res.data.data);
      setTotalPages(res.data.meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, search, sortBy, sortOrder]);

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await axios.delete(`/api/students/${id}`);
      fetchStudents();
    }
  };

  const columns = [
    { key: "studentId", label: "Student ID" },
    { key: "firstName", label: "First Name" },
    { key: "lastName", label: "Last Name" },
    { key: "email", label: "Email" },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    {
      key: "actions",
      label: "Actions",
      render: (row: any) => (
        <div className={styles.actions}>
          <button
            className={styles.btnView}
            onClick={() =>
              router.push(`/dashboard/admin/edit-student/${row.id}`)
            }
          >
            Edit
          </button>
          <button
            className={styles.btnDelete}
            onClick={() => handleDelete(row.id)}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <div className={styles.header}>
            <h1 className={styles.pageTitle}>Students</h1>
            <button
              className={styles.btnAdd}
              onClick={() => router.push("/dashboard/admin/register")}
            >
              + Register Student
            </button>
          </div>
          <div className={styles.filters}>
            <input
              type="text"
              placeholder="Search by name, ID, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <Table columns={columns} data={students} />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
