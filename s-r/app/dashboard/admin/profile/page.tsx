"use client";

import { useEffect, useState } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Navbar from "@/components/layout/Navbar";
import styles from "./page.module.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema } from "@/lib/validators";

export default function AdminProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
  });

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      setUser(res.data);
      reset({
        username: res.data.username,
      });
      setLoading(false);
    });
  }, [reset]);

  const onSubmit = async (data: any) => {
    try {
      await axios.put("/api/profile", data);
      setMessage("Profile updated successfully");
    } catch (error) {
      setMessage("Update failed");
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    try {
      await axios.post("/api/profile/upload", formData);
      setMessage("Image uploaded");
      const res = await axios.get("/api/auth/me");
      setUser(res.data);
    } catch (error) {
      setMessage("Upload failed");
    }
  };

  return (
    <div className={styles.container}>
      <AdminSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>Admin Profile</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className={styles.profileCard}>
              <div className={styles.imageSection}>
                <img
                  src={
                    user.image
                      ? `/uploads/${user.image}`
                      : "/default-avatar.png"
                  }
                  alt="Profile"
                  className={styles.profileImage}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                />
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                <div className={styles.field}>
                  <label>Username</label>
                  <input {...register("username")} className={styles.input} />
                  {errors.username && (
                    <p className={styles.error}>{errors.username.message}</p>
                  )}
                </div>
                <button type="submit" className={styles.button}>
                  Update Profile
                </button>
                {message && <p className={styles.message}>{message}</p>}
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
