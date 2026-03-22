"use client";
import Image from "next/image";

const Verification = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4ede4] px-4">
      <div className="w-full max-w-lg text-center flex flex-col items-center">

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="logo"
            width={40}
            height={40}
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-700 mb-3 text-center">
          We emailed you a code
        </h1>

        <p className="text-gray-500 mb-8 text-sm md:text-base text-center">
          Enter the 6-digit code sent to your email to continue.
        </p>

        {/* OTP Boxes */}
        <div className="flex justify-center gap-3 mb-8 text-gray-700 w-full">
          {Array(6)
            .fill("")
            .map((_, i) => (
              <input
                key={i}
                maxLength={1}
                onChange={(e) => {
                  if (e.target.value && e.target.nextSibling) {
                    e.target.nextSibling.focus();
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
                    e.target.previousSibling.focus();
                  }
                }}
                className="w-14 h-14 text-center text-xl font-semibold border border-gray-300 rounded-xl focus:outline-none focus:border-[#4A154B] transition"
              />
            ))}
        </div>
        <div>
          <button className="w-full px-10 mb-3 bg-[#4A154B] text-white py-3 rounded-lg font-semibold hover:scale-[1.02] active:scale-[0.98] transition">
        Continue
          </button>
        </div>

        {/* Info */}
        <p className="text-sm text-gray-400 mb-4 text-center">
          Didn’t receive the email? Check your spam folder or open Gmail.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 items-center w-full">
          <button className="text-[#771978] font-semibold hover:underline text-center">
           Can't find your code ? Request a new code
          </button>
          <button
            onClick={() => window.open("https://mail.google.com", "_blank")}
            className="bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition w-full text-center"
          >
            Open Gmail
          </button>
          <button className="text-gray-400 hover:underline text-sm text-center">
            Try another email
          </button>
        </div>

      </div>
    </div>
  );
};

export default Verification;
