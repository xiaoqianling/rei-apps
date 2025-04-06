export function isProduction(): boolean {
  if (process.env.NODE_ENV === undefined) {
    return false;
  }
  return process.env.NODE_ENV.trim() === "production";
}
