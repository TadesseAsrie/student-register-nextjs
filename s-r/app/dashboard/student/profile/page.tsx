"use client";

import { useEffect, useState } from "react";
import StudentSidebar from "@/components/layout/StudentSidebar";
import Navbar from "@/components/layout/Navbar";
import styles from "./page.module.css";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileUpdateSchema, changePasswordSchema } from "@/lib/validators";

export default function StudentProfile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
    reset,
  } = useForm({
    resolver: zodResolver(profileUpdateSchema),
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    axios.get("/api/auth/me").then((res) => {
      setUser(res.data);
      if (res.data.student) {
        reset({
          firstName: res.data.student.firstName,
          lastName: res.data.student.lastName,
          email: res.data.student.email,
          phone: res.data.student.phone,
          address: res.data.student.address,
        });
      }
      setLoading(false);
    });
  }, [reset]);

  const onProfileUpdate = async (data: any) => {
    try {
      await axios.put("/api/profile", data);
      setMessage("Profile updated");
    } catch (error) {
      setMessage("Update failed");
    }
  };

  const onPasswordChange = async (data: any) => {
    try {
      await axios.post("/api/auth/change-password", data);
      setMessage("Password changed");
      resetPassword();
    } catch (error: any) {
      setMessage(error.response?.data?.error || "Change failed");
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

  if (loading) return <p>Loading...</p>;

  const student = user?.student;

  return (
    <div className={styles.container}>
      <StudentSidebar />
      <div className={styles.main}>
        <Navbar />
        <div className={styles.content}>
          <h1 className={styles.pageTitle}>My Profile</h1>
          <div className={styles.profileCard}>
            <div className={styles.imageSection}>
              <img
                src={
                  student?.image
                    ? `/uploads/${student.image}`
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
            <div className={styles.info}>
              <p>
                <strong>Student ID:</strong> {student?.studentId}
              </p>
              <p>
                <strong>Name:</strong> {student?.firstName}{" "}
                {student?.middleName} {student?.lastName}
              </p>
              <p>
                <strong>Department:</strong> {student?.department}
              </p>
              <p>
                <strong>Year:</strong> {student?.year}
              </p>
              <p>
                <strong>Semester:</strong> {student?.semester}
              </p>
              <p>
                <strong>Email:</strong> {student?.email}
              </p>
              <p>
                <strong>Phone:</strong> {student?.phone || "N/A"}
              </p>
              <p>
                <strong>Address:</strong> {student?.address || "N/A"}
              </p>
              <p>
                <strong>Gender:</strong> {student?.gender}
              </p>
              <p>
                <strong>DOB:</strong>{" "}
                {student?.dob ? new Date(student.dob).toLocaleDateString() : ""}
              </p>
              <p>
                <strong>Registered:</strong>{" "}
                {new Date(student?.createdAt).toLocaleDateString()}
              </p>
            </div>

            <div className={styles.tabs}>
              <button
                className={activeTab === "profile" ? styles.activeTab : ""}
                onClick={() => setActiveTab("profile")}
              >
                Edit Profile
              </button>
              <button
                className={activeTab === "password" ? styles.activeTab : ""}
                onClick={() => setActiveTab("password")}
              >
                Change Password
              </button>
            </div>

            <div className={styles.tabContent}>
              {activeTab === "profile" && (
                <form
                  onSubmit={handleProfileSubmit(onProfileUpdate)}
                  className={styles.form}
                >
                  <div className={styles.field}>
                    <label>First Name</label>
                    <input
                      {...registerProfile("firstName")}
                      className={styles.input}
                    />
                    {profileErrors.firstName && (
                      <p className={styles.error}>
                        {profileErrors.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Last Name</label>
                    <input
                      {...registerProfile("lastName")}
                      className={styles.input}
                    />
                    {profileErrors.lastName && (
                      <p className={styles.error}>
                        {profileErrors.lastName.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Email</label>
                    <input
                      {...registerProfile("email")}
                      className={styles.input}
                    />
                    {profileErrors.email && (
                      <p className={styles.error}>
                        {profileErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Phone</label>
                    <input
                      {...registerProfile("phone")}
                      className={styles.input}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Address</label>
                    <input
                      {...registerProfile("address")}
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className={styles.button}>
                    Update Profile
                  </button>
                </form>
              )}

              {activeTab === "password" && (
                <form
                  onSubmit={handlePasswordSubmit(onPasswordChange)}
                  className={styles.form}
                >
                  <div className={styles.field}>
                    <label>Current Password</label>
                    <input
                      type="password"
                      {...registerPassword("currentPassword")}
                      className={styles.input}
                    />
                    {passwordErrors.currentPassword && (
                      <p className={styles.error}>
                        {passwordErrors.currentPassword.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>New Password</label>
                    <input
                      type="password"
                      {...registerPassword("newPassword")}
                      className={styles.input}
                    />
                    {passwordErrors.newPassword && (
                      <p className={styles.error}>
                        {passwordErrors.newPassword.message}
                      </p>
                    )}
                  </div>
                  <div className={styles.field}>
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      {...registerPassword("confirmNewPassword")}
                      className={styles.input}
                    />
                    {passwordErrors.confirmNewPassword && (
                      <p className={styles.error}>
                        {passwordErrors.confirmNewPassword.message}
                      </p>
                    )}
                  </div>
                  <button type="submit" className={styles.button}>
                    Change Password
                  </button>
                </form>
              )}
            </div>

            {message && <p className={styles.message}>{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
