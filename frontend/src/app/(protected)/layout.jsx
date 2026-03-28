"use client";

"use client";

import { useState } from "react";
import SettingHome from "../components/models/settingHome";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { applyTheme } from "../../lib/theme";

export default function ProtectedLayout({ children }) {
  const [openSettings, setOpenSettings] = useState(false);

  const fetchUser = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/me`, {
      credentials: "include",
    });
    const data = await res.json();
    return data?.data;
  };

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: fetchUser,
  });

  useEffect(() => {
    if (user?.appearance) {
      applyTheme(user.appearance.mode, user.appearance.theme);
    }
  }, [user]);

  const handleOpenSettings = () => {
    setOpenSettings(true);
  };

  return (
    <>
      {children}
      

      {openSettings && (
        <SettingHome onClose={() => setOpenSettings(false)} />
      )}
    </>
  );
}
