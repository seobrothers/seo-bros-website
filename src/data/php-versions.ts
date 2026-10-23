// PHP release branches and their support windows. Powers the EOL lookup on
// /tools/php-version-checker/ and the status label the checker API returns.
//
// Source: php.net/supported-versions.php and php.net/eol.php. PHP's policy
// since 2024: two years of active support, then two years of security-only
// fixes, then end of life. Update this table once a year when a new branch
// ships (late November) and the oldest branch drops off.
//
// Dates are ISO (YYYY-MM-DD). Status is computed at runtime from today's date,
// so the page stays correct as deadlines pass without a rebuild.

export interface PhpBranch {
  branch: string;
  released: string;
  activeUntil: string;
  securityUntil: string;
}

export const PHP_BRANCHES: PhpBranch[] = [
  { branch: "8.5", released: "2025-11-20", activeUntil: "2027-12-31", securityUntil: "2029-12-31" },
  { branch: "8.4", released: "2024-11-21", activeUntil: "2026-12-31", securityUntil: "2028-12-31" },
  { branch: "8.3", released: "2023-11-23", activeUntil: "2025-12-31", securityUntil: "2027-12-31" },
  { branch: "8.2", released: "2022-12-08", activeUntil: "2024-12-31", securityUntil: "2026-12-31" },
  { branch: "8.1", released: "2021-11-25", activeUntil: "2023-11-25", securityUntil: "2025-12-31" },
  { branch: "8.0", released: "2020-11-26", activeUntil: "2022-11-26", securityUntil: "2023-11-26" },
  { branch: "7.4", released: "2019-11-28", activeUntil: "2021-11-28", securityUntil: "2022-11-28" },
  { branch: "7.3", released: "2018-12-06", activeUntil: "2020-12-06", securityUntil: "2021-12-06" },
  { branch: "7.2", released: "2017-11-30", activeUntil: "2019-11-30", securityUntil: "2020-11-30" },
  { branch: "7.1", released: "2016-12-01", activeUntil: "2018-12-01", securityUntil: "2019-12-01" },
  { branch: "7.0", released: "2015-12-03", activeUntil: "2018-01-01", securityUntil: "2019-01-10" },
  { branch: "5.6", released: "2014-08-28", activeUntil: "2017-01-19", securityUntil: "2018-12-31" },
];

// WordPress's floor. WordPress 7.0 raised the minimum from 7.2.24 to 7.4 and
// is tested against 7.4 through 8.5. Anything below the floor cannot run
// current WordPress at all.
export const WORDPRESS_MIN_PHP = "7.4";

export type PhpStatus = "active" | "security" | "eol" | "unknown";

export function phpStatus(branch: string, today = new Date()): PhpStatus {
  const row = PHP_BRANCHES.find((b) => b.branch === branch);
  if (!row) return "unknown";
  const t = today.getTime();
  if (t <= new Date(row.activeUntil + "T23:59:59Z").getTime()) return "active";
  if (t <= new Date(row.securityUntil + "T23:59:59Z").getTime()) return "security";
  return "eol";
}

/** "8.3.8" -> "8.3". Returns null if it does not look like a PHP version. */
export function toBranch(version: string): string | null {
  const m = /^(\d+)\.(\d+)/.exec(version.trim());
  return m ? `${m[1]}.${m[2]}` : null;
}
