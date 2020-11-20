/**
 * Parses program arguments under the format <key>=<value>.
 */
export function getArgs(args) {
  const parsed = {};
  for (const arg of args) {
    const split = arg.split("=");
    parsed[split[0]] = split[1];
  }

  return parsed;
}

/**
 * Log to the terminal and program log.
 */
export function log(ns, ...args) {
  const log = [`[${ns.getHostname()}]`, ...args].join(" ");

  ns.tprint(log);
  ns.print(log);
}

/**
 * Parses big numbers.
 */
export function parseBigNumber(number) {
  const UNITS = { k: 1000, M: 1000000 };
  const unit = number.slice(-1);
  if (UNITS[unit] == null) {
    throw new Error("Unit not found.");
  }

  return parseFloat(number.slice(0, -1)) * UNITS[unit];
}

/**
 * Formats any number as a big number.
 */
export function formatBigNumber(number) {
  if (number > 1000000) {
    return `${(number / 1000000).toFixed(2)}M`;
  }

  if (number > 1000) {
    return `${(number / 1000).toFixed(2)}k`;
  }

  return number.toFixed(2);
}

/**
 * Formats seconds to minutes.
 */
export function formatTime(seconds) {
  return `${(seconds / 60).toFixed(2)}min`;
}
