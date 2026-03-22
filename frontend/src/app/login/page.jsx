"use client";
import Link from "next/link";
import Image from "next/image";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f4ede4] to-white px-4">
      <div className="w-full max-w-md  p-8">

        {/* Logo */}
        <div className="flex gap-3 items-center mb-6 justify-center">
          <Image
            src="/logo.png"
            alt="Spike Logo"
            width={40}
            height={40}
          />
          <h1 className="text-3xl font-bold text-[#4A154B] tracking-tight">
            Spike
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Enter your email to continue
          </h2>
          <p className="font-medium mt-2 text-sm text-gray-500">
            Use your work email address for better experience.
          </p>
        </div>

        {/* Input */}
        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="name@company.com"
            className="border border-gray-300 px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A154B] placeholder:text-gray-400 transition"
          />
        </div>

        {/* Button */}
        <Link
          href="/login/verification"
          className="block text-center w-full bg-[#4A154B] text-white py-3 rounded-lg font-semibold mt-6 hover:scale-[1.02] active:scale-[0.98] transition"
        >
          Continue →
        </Link>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-[1px] bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-[1px] bg-gray-200"></div>
        </div>

        {/* Google Button */}
        <button className="w-full border border-gray-300 py-3 rounded-lg text-gray-800 font-semibold flex items-center justify-center gap-3 hover:bg-gray-50 transition">
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/0/09/IOS_Google_icon.png"
            alt="Google"
            width={22}
            height={22}
          />
          Continue with Google
        </button>

        {/* Footer Text */}
        <p className="text-gray-400 text-xs mt-6 text-center leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>

      </div>
    </div>
  );
};

export default Login;
