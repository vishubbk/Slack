"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const workspaces = ['John',"hiaa","siaa","vishu"];
  const [workspaceId, setWorkspaceId] = useState("");



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4ede4] to-white px-4">
      <div className="w-full max-w-md p-6">
        {/* Logo */}
        <div className="flex gap-3 items-center mb-6 justify-center">
          <Image src="/logo.png" alt="Spike Logo" width={40} height={40} />
          <h1 className="text-3xl font-bold text-[#4A154B] tracking-tight">
            Spike
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back!
          </h2>
          <p className=" mt-2 text-md text-gray-500">
            Choose a Workspace to get back to work with your team
          </p>
        </div>
        {/* Your Workspaces */}
        <div>
          <div>
             <h5 className="font-semibold text-">Ready to launch</h5>
          <p className="text-gray-500 text-sm"> leptopbbkup@gmail.com</p>
          </div>

          <div className="flex flex-col gap-2 mt-3 max-h-[300px] overflow-y-auto no-scrollbar">
            {workspaces.map((name, index) => (
              <div
                key={index}
                onClick={() => {
                  const id = `workspace-${index}`;
                  setWorkspaceId(id);
                  router.push(`/workspace/${id}`);
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const id = `workspace-${index}`;
                    setWorkspaceId(id);
                    router.push(`/workspace/${id}`);
                  }
                }}
                className={`flex w-full items-center justify-between p-3 border rounded-lg cursor-pointer transition ${
                  workspaceId === `workspace-${index}`
                    ? "border-[#4A154B] bg-[#f4ede4]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-md flex items-center justify-center font-bold text-gray-700">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{name}</p>
                    <p className="text-xs text-gray-500">1 member</p>
                  </div>
                </div>

                <span className="text-gray-400">→</span>
              </div>
            ))}
          </div>
        </div>


        {/* Footer Text */}
        <p className="text-gray-400 text-xs mt-6 text-center leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Login;
