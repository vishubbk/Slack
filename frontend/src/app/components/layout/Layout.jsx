"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { applyTheme } from "../../../lib/theme";

import TopNavbar from "../navbar/TopNavbar";
import MobileNavbar from "../mobile/MobileNavbar";
import Sidebar from "../sidebarNav/sidebarNav";

export default function Layout({ children, onOpenSettings }) {
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

  useEffect(() => {
    if (user?.appearance) {
      applyTheme(user.appearance.mode, user.appearance.theme);
    }
  }, [user]);

  const isOwner = workspace?.owner?._id === user?._id;

  return (
    <div className="flex flex-col h-screen">

      {/* 🔥 TOP NAVBAR */}
      <TopNavbar user={user} workspace={workspace} />

      {/* 🔥 MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* 🔥 SIDEBAR */}
        <Sidebar
          id={id}
          workspace={workspace}
          user={user}
          isOwner={isOwner}
          onOpenSettings={onOpenSettings}
        />

        {/* 🔥 CONTENT */}
        <div className="flex-1 p-4 bg-[color:var(--background)] text-[color:var(--foreground)] overflow-auto">
          {children}
        </div>

      </div>

      {/* 🔥 MOBILE NAV */}
      <MobileNavbar id={id} />
    </div>
  );
}
