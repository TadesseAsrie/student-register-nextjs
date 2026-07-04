"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/validators";
import axios from "axios";
import styles from "./Login.module.css";

type LoginForm = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/auth/login", data);
      if (res.status === 200) {
        const user = res.data.user;
        if (user.role === "ADMIN") {
          router.push("/dashboard/admin");
        } else {
          router.push("/dashboard/student/profile");
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Student Registration System</h1>
        <h2 className={styles.subtitle}>Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.field}>
            <label>Username</label>
            <input
              type="text"
              {...register("username")}
              className={styles.input}
            />
            {errors.username && (
              <p className={styles.error}>{errors.username.message}</p>
            )}
          </div>
          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              {...register("password")}
              className={styles.input}
            />
            {errors.password && (
              <p className={styles.error}>{errors.password.message}</p>
            )}
          </div>
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className={styles.footer}>
          <a href="#">Forgot Password?</a>
        </div>
      </div>
    </div>
  );
}
