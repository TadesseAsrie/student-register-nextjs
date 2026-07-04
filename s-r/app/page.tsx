// app/page.tsx
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export default async function RootPage() {
  const token = (await cookies()).get("token")?.value;

  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      if (payload.role === "ADMIN") {
        redirect("/dashboard/admin");
      } else {
        redirect("/dashboard/student/profile");
      }
    }
  }

  redirect("/login");
}
