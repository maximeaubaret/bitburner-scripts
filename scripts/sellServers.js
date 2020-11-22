import { getNodes } from "/lib/purchaseServer.js";
import { log, getArgs } from "/lib/utils.js";

export async function main(ns) {
  const nodes = getNodes(ns);

  for (const node of nodes) {
    log(ns, "Deleting node", node);

    // Kill scripts running on server
    await ns.killall(node);

    // Delete server
    await ns.deleteServer(node);
  }
}
