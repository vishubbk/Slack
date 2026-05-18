"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import WorkspaceSettings from "./workspaceSettings.jsx";
import EditWorkspace from "./editWorkspace.jsx";
import ManageMembers from "./manageMembers.jsx";
import { useParams } from "next/navigation";



const SettingsPage = () => {
    const { id } = useParams();

  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "workspace";


const {
  data: workspace,
  isLoading,
  error,
} = useQuery({
  queryKey: ["workspace", id],
  queryFn: () =>
    fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspaces/${id}`),
});




  return (
    <div className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)] p-6">
      {/* Top Navbar */}
      <div className="flex gap-4 border-b border-[color:var(--border)] pb-4 mb-6 overflow-x-auto no-scrollbar">
        <Link
          href="?tab=workspace"
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            tab === "workspace"
              ? "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]"
              : "bg-[color:var(--card)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]"
          }`}
        >
          Workspace Settings
        </Link>

        <Link
          href="?tab=edit"
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            tab === "edit"
              ? "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]"
              : "bg-[color:var(--card)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]"
          }`}
        >
          Edit Workspace
        </Link>

        <Link
          href="?tab=members"
          className={`px-4 py-2 rounded-lg transition whitespace-nowrap ${
            tab === "members"
              ? "bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)]"
              : "bg-[color:var(--card)] border border-[color:var(--border)] hover:bg-[color:var(--accent)]"
          }`}
        >
          Manage Members
        </Link>
      </div>

      {/* Dynamic Content */}
      <div className="bg-[color:var(--card)] border border-[color:var(--border)] rounded-2xl p-6 shadow-sm text-[color:var(--card-foreground)]">
        {tab === "workspace" && <WorkspaceSettings />}

        {tab === "edit" && <EditWorkspace workspace={workspace} />}

        {tab === "members" && <ManageMembers />}
      </div>
    </div>
  );
};

export default SettingsPage;
