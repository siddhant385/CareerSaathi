import type { Metadata } from "next";
import { AdminWorkspace } from "./components/admin-workspace";

export const metadata: Metadata = {
  title: "Senior Counsellor & Admin Dashboard | CareerSaathi",
  description:
    "Family sentiment tracking, parent callback operations, and verified vocational trade outcome management.",
};

export default function AdminPage() {
  return <AdminWorkspace />;
}
