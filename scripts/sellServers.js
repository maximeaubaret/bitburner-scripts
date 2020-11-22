// @ts-check

import { getNodes } from "/lib/purchaseServer.js";
import { log } from "/lib/utils.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const nodes = getNodes(ns);

  for (const node of nodes) {
    log(ns, "Deleting node", node);

    // Kill scripts running on server
    ns.killall(node);

    // Delete server
    ns.deleteServer(node);
  }
}
