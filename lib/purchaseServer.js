/**
 * Purchases a server if possible.
 */
export async function purchaseServer(ns, desiredRam = 8) {
  const limit = ns.getPurchasedServerLimit();
  const currentNodes = getNodes(ns);

  // We have exhausted the number of nodes we can have.
  if (currentNodes.length >= limit) {
    return false;
  }

  const hasEnoughMoneyToBuyServer =
    ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(desiredRam);

  if (!hasEnoughMoneyToBuyServer) {
    return false;
  }

  const newNodeName = getNewNodeName(ns);
  ns.print("Purchasing server...");

  return (await ns.purchaseServer(newNodeName, desiredRam)) != "";
}

/**
 * Returns our "node-xxx" servers.
 */
export function getNodes(ns) {
  return ns.scan().filter((h) => h.match(/^node-/));
}

/**
 * Based on the list of current nodes, determine the index for the new node.
 */
function getNewNodeIndex(ns) {
  const nodes = getNodes(ns);
  if (nodes.length === 0) {
    return 0;
  }

  const numbers = nodes.map((h) => parseFloat(h.replace(/^node-/, "")));

  const max = numbers.reduce((prev, curr) => (curr > prev ? curr : prev));
  return max + 1;
}

/**
 * Return the next node name.
 */
function getNewNodeName(ns) {
  return sprintf("node-%03i", getNewNodeIndex(ns));
}
