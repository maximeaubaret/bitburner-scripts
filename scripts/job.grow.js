import { getArgs, log } from "/lib/utils.js";

export async function main(ns) {
  const { target, threads = 1, silent = false } = getArgs(ns.args);

  if (target == null) {
    log(ns, "Missing target parameter.");
    return;
  }

  log(ns, "Growing target", target, "with", threads, "threads.", {
    printInTerminal: !silent,
  });

  await ns.grow(target, { threads });
}
