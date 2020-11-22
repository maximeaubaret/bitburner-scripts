// @ts-check

import { log } from "/lib/utils.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const script = ns.args[0];

  if (script == null) {
    log(ns, "Missing script as first argument.");
    return;
  }

  const ram = ns.getScriptRam(script);
  log(ns, "Script", script, "takes", ram, "of RAM.");
}
