import { getHostsTree } from "/lib/scan.js";
import { log, formatBigNumber } from "/lib/utils.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const tree = getHostsTree(ns);
  if (tree == null) {
    return;
  }

  printTree(ns, tree);
}

/**
 * @param {IGame} ns
 * @param {import("/lib/scan").Host} host
 */
function printTree(ns, host, level = 1) {
  log(ns, padding(level), `${host.status} [${host.name}]`);
  log(ns, padding(level), `  - Required ports`, host.requiredPorts);
  log(
    ns,
    padding(level),
    `  - Required hacking level`,
    host.requiredHackingLevel
  );
  log(ns, padding(level), `  - RAM`, host.serverRam);
  log(
    ns,
    padding(level),
    `  - Money`,
    formatBigNumber(host.availableMoneyOnServer)
  );
  log(ns, padding(level), `  - Max Money`, formatBigNumber(host.maxMoney));
  log(
    ns,
    padding(level),
    `  - Money stolen per thread`,
    formatBigNumber(host.moneyPerThread)
  );
  log(ns);

  if (host.neighboors != null) {
    host.neighboors.forEach((neighboor) => printTree(ns, neighboor, level + 1));
  }
}

function padding(level = 1) {
  const pad = [];
  for (let i = 0; i < level - 1; i++) {
    pad.push("  ");
  }
  return pad.join("");
}
