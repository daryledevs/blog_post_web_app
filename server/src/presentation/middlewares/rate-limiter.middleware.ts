import rateLimit   from "express-rate-limit";
import * as dotenv from "dotenv";
dotenv.config();

const rateLimiter = rateLimit({
  // 24 hrs in milliseconds
  windowMs: process.env.RATE_LIMIT_WINDOW as unknown as number,
  // maximum number of request inside a window
  max: process.env.RATE_LIMIT_MAX as unknown as number,
  // the message when they exceed limit
  message: "You have exceeded the 100 requests in 24 hrs limit!",
  // Return rate limit info in the `RateLimit-*` headers
  standardHeaders: true,
  // Disable the `X-RateLimit-*` headers
  legacyHeaders: false,
});

export default rateLimiter;