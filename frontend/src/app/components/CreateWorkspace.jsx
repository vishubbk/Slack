"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";

const CreateWorkspace = () => {
  return (
    <div className="w-[55vw]  mx-auto px-2 mb-10">
      <div className="w-full  rounded-2xl p-5 md:p-6 flex flex-col gap-5 border border-gray-200 shadow-sm hover:shadow-md transition">

        {/* Top Section */}
        <div className="flex items-start justify-between gap-4 w-full bg-[#f6eddf] p-4 rounded-2xl">
          <div className="flex items-start gap-3">
            <Image
              src="https://a.slack-edge.com/bv1-13/get-started-workspaces-icon-6cacbb8.svg"
              width={48}
              height={48}
              alt="workspace"
            />

            <div className="flex flex-col gap-1">
              <p className="text-sm md:text-sm  text-gray-800">
                Want to use Slack with a different team?
              </p>

              <p className="text-xs md:text-sm text-gray-500 leading-relaxed max-w-xs">
                Create a new workspace for your team or project.
              </p>
            </div>
          </div>

          {/* Button Top Right */}
          <button className="bg-[#4A154B] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 whitespace-nowrap">
            Create New Workspace
          </button>
        </div>

        {/* Footer */}
        <div className="text-center text-xs md:text-sm text-gray-500">
          <p className="mb-1">Not seeing your workspace?</p>
          <Link
            href="/login"
            className="text-[#4A154B] font-medium hover:underline"
          >
            Try a different email
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;
