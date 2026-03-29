"use client";

import React from "react";
import { applyTheme } from "../../../lib/theme";

const themes = [
  "spike",
  "iceBlue",
  "forest",
  "sunset",
  "midnight",
  "rose",
  "neon",
  "cosmic",
];

const SettingHome = ({ onClose }) => {
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
            <h3 className="font-semibold mb-4">Theme</h3>

            <div className="grid grid-cols-3 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme}
                  onClick={() => applyTheme("dark", theme)}
                  className="text-sm p-3 rounded-lg border border-[color:var(--border)] hover:bg-[color:var(--accent)] transition"
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
