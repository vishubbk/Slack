"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

const mainNavbar = () => {
  const { id } = useParams();

  // 🔥 fetch workspace
  const fetchWorkspace = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspaces/${id}`,
      { credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch workspace");
    return data?.data || null;
  };

  // 🔥 fetch user
  const fetchUser = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/me`,
      { credentials: "include" }
    );
    const data = await res.json();
    if (!res.ok) throw new Error("Failed to fetch user");
    return data?.data || null;
  };

  const { data: workspace, isLoading: workspaceLoading } = useQuery({
    queryKey: ["workspace", id],
    queryFn: fetchWorkspace,
    enabled: !!id,
  });

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
  });

  if (workspaceLoading || userLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const isOwner = workspace?.owner?._id === user?._id;

  return (
    <div className="flex h-screen bg-[#1A1D21] text-white">
      <div className="">

      </div>

      {/* Left Mini Sidebar */}
      <div className="w-16 bg-[#4A154B] flex flex-col items-center py-4 gap-4">
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold">
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>

        <div className="flex flex-col gap-4 text-sm items-center mt-4">
          <span>🏠</span>
          <span>💬</span>
          <span>⭐</span>
          <span>⚙️</span>
        </div>
      </div>

    </div>
  );
};

export default mainNavbar;
