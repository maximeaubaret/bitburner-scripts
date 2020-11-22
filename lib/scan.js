const MAX_TRAVERSE = 50;

let availableExploits = 0;

export function getHosts(ns) {
  const tree = getHostsTree(ns);

  // Flatten the tree
  return flattenTree(tree);
}

export function getHostsTree(ns) {
  // Compute the availableExploits
  availableExploits = computeAvailableExploits(ns);

  // Start traversing, starting from "home"
  return recursiveScan(ns, "home");
}

function recursiveScan(ns, host, root = null, level = 1) {
  if (level >= MAX_TRAVERSE) {
    return;
  }

  const neighboors = ns
    .scan(host)
    .filter((host) => host != root)
    .map((neighboor) => recursiveScan(ns, neighboor, host, level + 1));

  return {
    ...getHostInfos(ns, host),

    neighboors,
  };
}

export function getHostInfos(ns, host) {
  const requiredPorts = ns.getServerNumPortsRequired(host);

  const requiredHackingLevel = ns.getServerRequiredHackingLevel(host);

  const hasRoot = ns.hasRootAccess(host);
  const exploitable = requiredPorts <= availableExploits;

  const serverRam = ns.getServerRam(host)[0];
  const maxMoney = ns.getServerMaxMoney(host);

  const availableMoneyOnServer = ns.getServerMoneyAvailable(host);
  const percentagePerThread = ns.hackAnalyzePercent(host) / 100;
  const moneyPerThread = percentagePerThread * availableMoneyOnServer;

  const weakenTime = ns.getWeakenTime(host);
  const growTime = ns.getGrowTime(host);
  const hackTime = ns.getHackTime(host);

  const hackChance = ns.hackChance(host);

  const minSecurityLevel = ns.getServerMinSecurityLevel(host);
  const securityLevel = ns.getServerSecurityLevel(host);
  const serverGrowth = ns.getServerGrowth(host);

  return {
    name: host,
    status: hasRoot ? "✅" : exploitable ? "⏩" : "❌",
    requiredPorts,
    exploitable,
    requiredHackingLevel,
    hasRoot,
    serverRam,
    maxMoney,
    availableMoneyOnServer,
    percentagePerThread,
    moneyPerThread,
    hackTime,
    growTime,
    weakenTime,
    hackChance,
    minSecurityLevel,
    securityLevel,
    serverGrowth,
  };
}

function flattenTree(tree) {
  const { neighboors, ...host } = tree;

  if (neighboors == null || neighboors.length == 0) {
    return host;
  }

  return [host, ...neighboors.map(flattenTree)].flat();
}

const EXPLOITS = [
  "BruteSSH.exe",
  "FTPCrack.exe",
  "relaySMTP.exe",
  "HTTPWorm.exe",
  "SQLInject.exe",
];

/**
 * Returns the number of currently available exploits
 */
function computeAvailableExploits(ns) {
  let availableExploits = 0;

  EXPLOITS.forEach((exploit) => {
    if (ns.fileExists(exploit)) {
      availableExploits++;
    }
  });

  return availableExploits;
}
