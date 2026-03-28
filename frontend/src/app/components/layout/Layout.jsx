"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { applyTheme } from "../../../lib/theme.js";

import TopNavbar from "../navbar/TopNavbar";
import MobileNavbar from "../mobile/MobileNavbar";
import Sidebar from "../sidebarNav/sidebarNav";

export default function Layout({ children }) {
  const { id } = useParams();

  const fetchData = async (url) => {
    const res = await fetch(url, { credentials: "include" });
    const data = await res.json();
    return data?.data || data;
  };

  const { data: workspace } = useQuery({
    queryKey: ["workspace", id],
    queryFn: () =>
      fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspaces/${id}`),
  });

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () =>
      fetchData(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/me`),
  });

  // 🔥 ADD THIS
  useEffect(() => {
    if (user?.appearance) {
      applyTheme(user.appearance.mode, user.appearance.theme);
    }
  }, [user]);

  const isOwner = workspace?.owner?._id === user?._id;

  return (
    <div>
      <TopNavbar user={user} workspace={workspace} />

      <div className="flex">
        <Sidebar id={id} workspace={workspace} user={user} isOwner={isOwner} />

        <div className="flex-1 p-4 bg-[var(--background)] text-[var(--foreground)] min-h-screen">
          {children}
        </div>
      </div>

      <MobileNavbar id={id} />
    </div>
  );
}
