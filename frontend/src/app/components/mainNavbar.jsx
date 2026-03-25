"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { HiHome } from "react-icons/hi";
import { IoChatbubbleSharp } from "react-icons/io5";
import { MdGroups3 } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MainNavbar = () => {
  const { id } = useParams();
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();

  // 🔥 fetch workspace
  const fetchWorkspace = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/workspaces/${id}`,
      { credentials: "include" }
    );
    const data = await res.json();
    console.log("📦 Workspace Full Response:", data);

    // handle both possible structures
    const workspaceData = data?.data || data;

    console.log("📦 Final Workspace Data:", workspaceData);
    if (!res.ok) throw new Error("Failed to fetch workspace");
    return workspaceData || null;
  };

  // 🔥 fetch user
  const fetchUser = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/me`,
      { credentials: "include" }
    );
    const data = await res.json();
    console.log("👤 User API Raw Response:", res);
    console.log("👤 User JSON:", data);
    console.log("👤 User Data:", data?.data);
    if (!res.ok) throw new Error("Failed to fetch user");
    return data?.data || data;
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

  console.log("🔍 Workspace Object:", workspace);
  console.log("🔍 Workspace ID:", workspace?._id);
  console.log("🔍 Workspace Owner:", workspace?.owner);
  console.log("🔍 Workspace Owner ID:", workspace?.owner?._id);
  console.log("🔍 Current User:", user);
  console.log("🔍 Current User ID:", user?._id);
  console.log("👑 Is Owner:", isOwner);

  return (
    <>
    <div className="w-full bg-[#4A154B] h-13 flex text-amber-50 justify-between items-center px-16">
      <div className="">
        {/* Timing Effect */}
        Good Morning {user?.fullName || "User"} 👋
      </div>
      <div className="font-semibold text-lg">
        {workspace?.name || "Workspace"}
      </div>

    </div>
<div className="flex h-[calc(100vh-50px)] md:h-screen bg-[#1A1D21] text-white pb-14 md:pb-0">


      {/* Left Sidebar */}
      <div className="w-16 md:w-20 bg-[#4A154B] flex flex-col items-center py-4 gap-6">

        {/* Workspace Icon */}
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center font-bold text-lg">
          {workspace?.name?.charAt(0).toUpperCase()}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-6 text-xs items-center mt-6">

          <Link href={`/workspace/${id}`} className="flex flex-col items-center gap-1 hover:text-white/80">
            <HiHome size={20} />
            <span className="hidden md:block">Home</span>
          </Link>

          <Link href={`/workspace/${id}/channels`} className="flex flex-col items-center gap-1 hover:text-white/80">
            <FaHashtag size={20} />
            <span className="hidden md:block">Channels</span>
          </Link>

          <Link href={`/workspace/${id}/messages`} className="flex flex-col items-center gap-1 hover:text-white/80">
            <IoChatbubbleSharp size={20} />
            <span className="hidden md:block">Messages</span>
          </Link>

          <Link href={`/workspace/${id}/groups`} className="flex flex-col items-center gap-1 hover:text-white/80">
            <MdGroups3 size={20} />
            <span className="hidden md:block">Groups</span>
          </Link>

          {isOwner && (
            <Link href={`/workspace/${id}/admin`} className="flex flex-col items-center gap-1 hover:text-white/80">
              <MdOutlineSettings size={20} />
              <span className="hidden md:block">Admin</span>
            </Link>
          )}

        </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 w-full bg-[#4A154B] flex justify-around items-center py-2 md:hidden z-50">

        <Link href={`/workspace/${id}`} className="flex flex-col items-center text-xs">
          <HiHome size={22} />
          <span>Home</span>
        </Link>

        <Link href={`/workspace/${id}/channels`} className="flex flex-col items-center text-xs">
          <FaHashtag size={22} />
          <span>Channels</span>
        </Link>

        <Link href={`/workspace/${id}/messages`} className="flex flex-col items-center text-xs">
          <IoChatbubbleSharp size={22} />
          <span>Messages</span>
        </Link>

        <Link href={`/workspace/${id}/groups`} className="flex flex-col items-center text-xs">
          <MdGroups3 size={22} />
          <span>Groups</span>
        </Link>

        {/* Profile */}
        <div className="relative">
          <div
            onClick={() => setOpenProfile(!openProfile)}
            className="flex flex-col items-center text-xs cursor-pointer"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <span>Profile</span>
          </div>

          {openProfile && (
            <div className="absolute bottom-14 right-0 bg-[#1A1D21] border border-white/10 rounded-lg w-40 shadow-lg">

              <div
                onClick={() => router.push(`/workspace/${id}/profile`)}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer"
              >
                Profile
              </div>

              <div
                onClick={() => router.push(`/workspace/${id}/settings`)}
                className="px-4 py-2 hover:bg-white/10 cursor-pointer"
              >
                Settings
              </div>

              <div
                onClick={() => {
                  fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                  router.push("/login");
                }}
                className="px-4 py-2 hover:bg-red-500/20 text-red-400 cursor-pointer"
              >
                Logout
              </div>

            </div>
          )}
        </div>
      </div>
      </div>

    </div>
    </>

  );
};

export default MainNavbar;
