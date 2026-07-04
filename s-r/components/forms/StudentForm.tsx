"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentSchema } from "@/lib/validators";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useState } from "react";
import styles from "./StudentForm.module.css";

interface StudentFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function StudentForm({ initialData, isEdit }: StudentFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: isEdit
      ? {
          studentId: initialData?.studentId,
          firstName: initialData?.firstName,
          middleName: initialData?.middleName,
          lastName: initialData?.lastName,
          gender: initialData?.gender,
          dob: initialData?.dob ? initialData.dob.split("T")[0] : "",
          email: initialData?.email,
          phone: initialData?.phone,
          department: initialData?.department,
          year: initialData?.year,
          semester: initialData?.semester,
          address: initialData?.address,
          username: initialData?.username,
        }
      : {},
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMessage("");
    try {
      const url = isEdit ? `/api/students/${initialData.id}` : "/api/students";
      const method = isEdit ? "put" : "post";
      await axios[method](url, data);
      setMessage(
        isEdit ? "Student updated" : "Student registered successfully",
      );
      if (!isEdit) {
        setTimeout(() => router.push("/dashboard/admin/students"), 1500);
      } else {
        router.push("/dashboard/admin/students");
      }
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Student ID</label>
          <input
            {...register("studentId")}
            className={styles.input}
            disabled={isEdit}
          />
          {errors.studentId && (
            <p className={styles.error}>{errors.studentId.message}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>First Name</label>
          <input {...register("firstName")} className={styles.input} />
          {errors.firstName && (
            <p className={styles.error}>{errors.firstName.message}</p>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Middle Name</label>
          <input {...register("middleName")} className={styles.input} />
        </div>
        <div className={styles.field}>
          <label>Last Name</label>
          <input {...register("lastName")} className={styles.input} />
          {errors.lastName && (
            <p className={styles.error}>{errors.lastName.message}</p>
          )}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Gender</label>
          <select {...register("gender")} className={styles.input}>
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.gender && (
            <p className={styles.error}>{errors.gender.message}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Date of Birth</label>
          <input type="date" {...register("dob")} className={styles.input} />
          {errors.dob && <p className={styles.error}>{errors.dob.message}</p>}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Email</label>
          <input type="email" {...register("email")} className={styles.input} />
          {errors.email && (
            <p className={styles.error}>{errors.email.message}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Phone</label>
          <input {...register("phone")} className={styles.input} />
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Department</label>
          <input {...register("department")} className={styles.input} />
          {errors.department && (
            <p className={styles.error}>{errors.department.message}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Year</label>
          <input
            type="number"
            {...register("year", { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.year && <p className={styles.error}>{errors.year.message}</p>}
        </div>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label>Semester</label>
          <input
            type="number"
            {...register("semester", { valueAsNumber: true })}
            className={styles.input}
          />
          {errors.semester && (
            <p className={styles.error}>{errors.semester.message}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Address</label>
          <input {...register("address")} className={styles.input} />
        </div>
      </div>

      {!isEdit && (
        <>
          <div className={styles.row}>
            <div className={styles.field}>
              <label>Username</label>
              <input {...register("username")} className={styles.input} />
              {errors.username && (
                <p className={styles.error}>{errors.username.message}</p>
              )}
            </div>
          </div>
          <div className={styles.row}>
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
            <div className={styles.field}>
              <label>Confirm Password</label>
              <input
                type="password"
                {...register("confirmPassword")}
                className={styles.input}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className={styles.actions}>
        <button type="submit" className={styles.button} disabled={loading}>
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Student"
              : "Register Student"}
        </button>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </form>
  );
}
