import rateLimit from "express-rate-limit";

const otpLimiter = rateLimit({
  windowMs: 15 * 1000, // ✅ 15 seconds
  max: 2, // ✅ max 2 requests per 15 sec

  message: {
    success: false,
    message: "Too many OTP requests. Please wait 15 seconds.",
  },

  standardHeaders: true, // ✅ modern headers
  legacyHeaders: false, // ❌ disable old headers

  // ✅ Better: email based limit (not just IP)
  keyGenerator: (req) => {
    return req.body.email || req.ip;
  },
});

export default otpLimiter;
