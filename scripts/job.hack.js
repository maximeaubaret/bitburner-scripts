// @ts-check

import { getArgs, log } from "/lib/utils.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const { target, threads = 1, silent = false } = getArgs(ns.args);

  if (target == null) {
    log(ns, "Missing target parameter.");
    return;
  }

  log(ns, "Hacking target", target, "with", threads, "threads.", {
    printInTerminal: !silent,
  });

  await ns.hack(target, { threads });
}
