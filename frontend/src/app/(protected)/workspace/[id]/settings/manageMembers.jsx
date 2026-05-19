"use client";

import { useState } from "react";
import { Mail, Users, Crown, UserPlus } from "lucide-react";

const ManageMembers = ({ workspace }) => {
  const [email, setEmail] = useState("");

  const handleInviteMember = () => {
    if (!email) return;

    console.log("Invite member:", email);

    setEmail("");
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <h2 className="text-3xl font-bold text-[color:var(--accent)] flex items-center gap-3">
            <Users size={30} />
            Manage Members
          </h2>

          <p className="text-[color:var(--muted-foreground)] mt-2">
            Invite and manage your workspace collaborators.
          </p>
        </div>

        <div className="px-4 py-2 rounded-xl bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)] font-medium shadow-sm">
          {workspace?.members?.length || 0} Members
        </div>
      </div>

      {/* Invite Section */}
      <div className="bg-[color:var(--background)] border border-[color:var(--border)] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <UserPlus size={22} />

          <h3 className="text-xl font-semibold">
            Invite New Member
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Mail
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[color:var(--muted-foreground)]"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member email"
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-[color:var(--card)] border border-[color:var(--border)] outline-none focus:ring-2 focus:ring-[color:var(--sidebar-accent)]"
            />
          </div>

          <button
            onClick={handleInviteMember}
            className="px-6 py-3 rounded-2xl bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)] font-semibold hover:opacity-90 transition shadow-sm"
          >
            Send Invite
          </button>
        </div>
      </div>

      {/* Members List */}
      <div className="bg-[color:var(--background)] border border-[color:var(--border)] rounded-3xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold">
            Workspace Members
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {workspace?.members?.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] hover:bg-[color:var(--accent)] transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`https://ui-avatars.com/api/?name=${member.fullName}`}
                  alt={member.fullName}
                  className="w-12 h-12 rounded-2xl object-cover border border-[color:var(--border)]"
                />

                <div>
                  <h4 className="font-semibold text-[color:var(--foreground)]">
                    {member.fullName}
                  </h4>

                  <p className="text-sm text-[color:var(--muted-foreground)]">
                    {member.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--sidebar-accent)] text-[color:var(--sidebar-accent-foreground)] text-sm font-medium">
                <Crown size={16} />
                Member
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageMembers;
