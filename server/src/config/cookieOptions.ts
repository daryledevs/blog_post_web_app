const { secure, sameSite }:any = function () {
  return `${process.env.NODE_ENV}`.trim() === "development"
    ? { secure: false, sameSite: "lax" }
    : { secure: true, sameSite: "none" };
};

const cookieOptions = {
  httpOnly: true,
  secure: secure,
  sameSite: sameSite,
  domain: "localhost",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week (days, hours, mins, milliseconds)
};

export default cookieOptions;