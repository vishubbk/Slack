"use client";

import React, { useState, useEffect } from "react";
import { applyTheme } from "../../../lib/theme";

const mode =[
  "light",
  "dark",
  "system"
]


const themes = [
  "iceBlue",
  "forest",
  "sunset",
  "midnight",
  "rose",
  "neon",
  "cosmic",
  
];


const SettingHome = ({ onClose }) => {
  const [currentMode, setCurrentMode] = useState("dark");
  const [currentTheme, setCurrentTheme] = useState("rose");

  useEffect(() => {
    try {
      const m = localStorage.getItem("app-mode") || "dark";
      const t = localStorage.getItem("app-theme") || "rose";
      setCurrentMode(m);
      setCurrentTheme(t);
    } catch {}
  }, []);

  const handleModeChange = async (selectedMode) => {
    try {
      // optimistic UI
      setCurrentMode(selectedMode);
      applyTheme(selectedMode, currentTheme);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/theme`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: selectedMode, theme: currentTheme }),
      });

      const data = await res.json();
      if (data?.status !== "success") throw new Error("Failed");
    } catch (error) {
      console.error("❌ MODE UPDATE ERROR:", error.message);
    }
  };

  const handleThemeChange = async (selectedTheme) => {
    try {
      // optimistic UI
      setCurrentTheme(selectedTheme);
      applyTheme(currentMode, selectedTheme);

      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/users/theme`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: selectedTheme, mode: currentMode }),
      });

      const data = await res.json();
      if (data?.status !== "success") throw new Error("Failed");
    } catch (error) {
      console.error("❌ THEME UPDATE ERROR:", error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      {/* Modal Card */}
      <div className="w-[92%] md:w-[720px] bg-[color:var(--card)] text-[color:var(--foreground)] rounded-xl shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
          <h2 className="font-semibold text-lg">Settings</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 rounded hover:bg-[color:var(--accent)]"
          >
            ✖
          </button>
        </div>

        <div className="flex">
          {/* Left Menu */}
          <div className="w-44 border-r border-[color:var(--border)] p-4">
            <div className="p-2 rounded bg-[color:var(--accent)] text-sm font-medium">
              Preferences
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 p-6">
            <h3 className="font-semibold mb-4">Mode</h3>

            <div className="grid grid-cols-3 gap-3">
              {mode.map((m) => (
                <button
                  key={m}
                  onClick={() => handleModeChange(m)}
                  className={`text-sm p-3 rounded-lg border border-[color:var(--border)] transition ${currentMode===m ? 'bg-[color:var(--accent)]' : 'hover:bg-[color:var(--accent)]'}`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          {/* Right Content */}
          <div className="flex-1 p-6">
            <h3 className="font-semibold mb-4">Theme</h3>

            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => handleThemeChange(theme)}
                  className={`text-sm p-3 rounded-lg border border-[color:var(--border)] transition ${currentTheme===theme ? 'bg-[color:var(--accent)]' : 'hover:bg-[color:var(--accent)]'}`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingHome;
