/**
 * Parses program arguments under the format <key>=<value>.
 * @param {Array<string>} args
 * @returns {any}
 */
export function getArgs(args) {
  /** @type {any} */
  const parsed = {};

  // Args should be <key>=<value>
  for (const arg of args) {
    const [key, value] = arg.split("=");

    if (value.toLowerCase() === "true") {
      parsed[key] = true;
    } else if (value.toLowerCase() === "false") {
      parsed[key] = false;
    } else {
      parsed[key] = value;
    }
  }

  return parsed;
}

/**
 * Log to the terminal and program log.
 * @param {IGame} ns
 * @param {(string | number | boolean | { printInTerminal: boolean })[]} args
 */
export function log(ns, ...args) {
  const lastArg = args[args.length - 1];
  let options = {
    printInTerminal: true,
  };

  if (typeof lastArg === "object") {
    args = args.slice(0, -1);
    options = lastArg;
  }

  const log = [`[${ns.getHostname()}]`, ...args].join(" ");

  if (options.printInTerminal) {
    ns.tprint(log);
  }

  ns.print(log);
}

/**
 * Parses big numbers.
 * @param {string} number
 */
export function parseBigNumber(number) {
  const UNITS = { k: 1000, M: 1000000, B: 1000000000 };

  const unit = number.slice(-1);

  // @ts-ignore
  if (UNITS[unit] == null) {
    throw new Error("Unit not found.");
  }

  // @ts-ignore
  return parseFloat(number.slice(0, -1)) * UNITS[unit];
}

/**
 * Formats any number as a big number.
 * @param {number} number
 */
export function formatBigNumber(number) {
  if (number < 1000) {
    return number.toFixed(2);
  }

  if (number < 1000000) {
    return `${(number / 1000).toFixed(2)}k`;
  }

  if (number < 1000000000) {
    return `${(number / 1000000).toFixed(2)}M`;
  }

  if (number < 1000000000000) {
    return `${(number / 1000000000).toFixed(2)}B`;
  }

  return number.toFixed(0);
}

/**
 * Formats seconds to minutes.
 * @param {number} seconds
 */
export function formatTime(seconds) {
  if (seconds < 60) {
    return `${seconds.toFixed(2)}secs`;
  }

  if (seconds < 60 * 60) {
    return `${(seconds / 60).toFixed(2)}mins`;
  }

  return `${(seconds / (60 * 60)).toFixed(2)}hours`;
}
