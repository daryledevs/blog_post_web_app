// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isTokenValid(accessToken: any, refreshToken: any) {
  if (accessToken === "null" || accessToken === null) return true;
  if (accessToken === "undefined" || accessToken === undefined) return true;
  if (refreshToken === "null" || refreshToken === null) return true;
  if (refreshToken === "undefined" || refreshToken === undefined) return true;
  return false;
}

export default isTokenValid;