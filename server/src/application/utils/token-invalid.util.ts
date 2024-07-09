// an empty token returns null as a string when used sessionStorage.getItem(...) function
function isTokenValid(token: any) {
  if (token === "null" || token === null) return true;
  if (token === "undefined" || token === undefined) return true;
  return false;
}

export default isTokenValid;