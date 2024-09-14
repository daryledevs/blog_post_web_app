import cookieOptions from "./cookie-options.config";

const secret = process.env.SESSION_SECRET!;

const sessionOptions = {
  secret: secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: cookieOptions.secure,
    httpOnly: cookieOptions.httpOnly,
    maxAge: cookieOptions.maxAge,
  },
};

export default sessionOptions;