"use client";
import Link from "next/link";
import { HiHome } from "react-icons/hi";
import { IoChatbubbleSharp } from "react-icons/io5";
import { MdGroups3, MdOutlineSettings } from "react-icons/md";
import { FaHashtag } from "react-icons/fa6";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";

export default function SidebarNav({ id, workspace, user, isOwner,onOpenSettings }) {
  const [openProfile, setOpenProfile] = useState(false);
  const router = useRouter();


  return (
    <div
     
      className="w-19 bg-[color:var(--sidebar)] text-[color:var(--sidebar-foreground)] hidden md:flex flex-col items-center py-4 gap-6 font-medium"
    >

  {/* Workspace Icon */}
  <div className="w-10 h-10 bg-[color:var(--sidebar-accent)] rounded-lg flex items-center justify-center font-semibold">
    {workspace?.name?.charAt(0)}
  </div>

  {/* Navigation */}
  <div className="flex flex-col gap-6 text-xs items-center mt-6">

    <Link href={`/workspace/${id}`} className="flex flex-col items-center gap-1 hover:text-[color:var(--primary)] transition">
      <HiHome size={18} />
      <span>Home</span>
    </Link>

    <Link href={`/workspace/${id}/channels`} className="flex flex-col items-center gap-1 hover:text-[color:var(--primary)] transition">
      <FaHashtag size={18} />
      <span>Channels</span>
    </Link>

    <Link href={`/workspace/${id}/messages`} className="flex flex-col items-center gap-1 hover:text-[color:var(--primary)] transition">
      <IoChatbubbleSharp size={18} />
      <span>Messages</span>
    </Link>

    <Link href={`/workspace/${id}/groups`} className="flex flex-col items-center gap-1 hover:text-[color:var(--primary)] transition">
      <MdGroups3 size={18} />
      <span>Groups</span>
    </Link>

    {isOwner && (
      <Link href={`/workspace/${id}/admin`} className="flex flex-col items-center gap-1 hover:text-[color:var(--primary)] transition">
        <MdOutlineSettings size={18} />
        <span>Admin</span>
      </Link>
    )}
  </div>

  {/* Profile */}
  <div className="absolute bottom-4 flex flex-col items-center">

    <div
      onClick={() => setOpenProfile(!openProfile)}
      className="w-10 h-10 bg-[color:var(--sidebar-accent)] rounded-full flex items-center justify-center cursor-pointer font-semibold"
    >
      {user?.fullName?.charAt(0)}
    </div>

    {openProfile && (
      <div className="absolute bottom-0 left-17 bg-[color:var(--card)] border border-[color:var(--border)] rounded-lg w-44 shadow-lg backdrop-blur-md">

        <div
          onClick={() => router.push(`/workspace/${id}/profile`)}
          className="px-4 py-2 hover:bg-[color:var(--accent)] transition cursor-pointer flex items-center gap-2 text-sm"
        >
          <FiUser /> Profile
        </div>

        <div
          onClick={onOpenSettings}
          className="px-4 py-2 hover:bg-[color:var(--accent)] transition cursor-pointer flex items-center gap-2 text-sm"
        >
          <FiSettings /> Settings
        </div>

        <div
          onClick={() => router.push(`/login`)}
          className="px-4 py-2 hover:bg-red-500/20 text-red-400 cursor-pointer flex items-center gap-2 text-sm border-t border-[color:var(--border)]"
        >
          <FiLogOut /> Sign Out
        </div>

      </div>
    )}
  </div>
</div>
  );
}
