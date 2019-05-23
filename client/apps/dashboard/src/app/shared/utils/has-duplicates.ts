export function hasDuplicates(arr: string[]) {
  const checks = {};

  for (const value of arr) {
    if (value in checks) {
      return true;
    }
    checks[value] = true;
  }

  return false;
}
