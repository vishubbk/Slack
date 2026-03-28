"use client";
import { TbSunset2 } from "react-icons/tb";
import { PiSunDimFill } from "react-icons/pi";
import { IoIosMoon } from "react-icons/io";

export default function TopNavbar({ user, workspace }) {
  const hour = new Date().getHours();

  let text = "Good Morning";
  let Icon = PiSunDimFill;

  if (hour >= 12 && hour < 17) {
    text = "Good Afternoon";
    Icon = TbSunset2;
  } else if (hour >= 17 && hour < 21) {
    text = "Good Evening";
    Icon = TbSunset2;
  } else if (hour >= 21 || hour < 5) {
    text = "Good Night";
    Icon = IoIosMoon;
  }

  return (
    <div className="w-full bg-[var(--sidebar)] h-13 flex text-[var(--sidebar-foreground)] justify-between items-center px-4 md:px-16 border-b border-[var(--border)]">
      <div className="flex items-center gap-2 text-[var(--primary)]">
        <Icon />
        <span>{text} {user?.fullName || "User"} 👋</span>
      </div>

      <div className="font-semibold text-lg tracking-wide">
        {workspace?.name || "Workspace"}
      </div>
    </div>
  );
}
