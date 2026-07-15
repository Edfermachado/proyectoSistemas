import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (session) {
    if (session.role === "superadmin") {
      redirect("/admin");
    } else if (["tenant_admin", "event_manager", "access_control"].includes(session.role as string)) {
      redirect("/faculty-admin");
    } else {
      redirect("/");
    }
  }

  return <>{children}</>;
}
