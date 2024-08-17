import { HelmetOptions } from "helmet";

const helmetConfig: HelmetOptions = {
  referrerPolicy: { policy: "no-referrer" as const },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
};

export default helmetConfig;
