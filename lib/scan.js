const MAX_TRAVERSE = 50;

let availableExploits = 0;

/**
 * @param {IGame} ns
 */
export function getHosts(ns) {
  const tree = getHostsTree(ns);
  if (tree == null) {
    return [];
  }

  // Flatten the tree
  const flatten = flattenTree(tree);
  if (!Array.isArray(flatten)) {
    return [flatten];
  }

  return flatten;
}

/**
 * @param {IGame} ns
 */
export function getHostsTree(ns) {
  // Compute the availableExploits
  availableExploits = computeAvailableExploits(ns);

  // Start traversing, starting from "home"
  return recursiveScan(ns, "home");
}

/**
 *
 * @param {IGame} ns
 * @param {string} hostname
 * @param {string|null} root
 * @param {number} level
 *
 * @returns {Host | null}
 */
function recursiveScan(ns, hostname, root = null, level = 1) {
  if (level >= MAX_TRAVERSE) {
    return null;
  }

  /** @type {Array<Host>} */

  // @ts-ignore
  const neighboors = ns
    .scan(hostname)
    .filter((host) => host != root)
    .map((neighboor) => recursiveScan(ns, neighboor, hostname, level + 1))
    .filter((host) /*  */ => host != null);

  return {
    ...getHostInfos(ns, hostname),

    neighboors,
  };
}

/**
 * @typedef {Object} Host
 *
 * @property {string} name
 * @property {string} status
 * @property {number} requiredPorts
 * @property {boolean} exploitable
 * @property {number} requiredHackingLevel
 * @property {boolean} hasRoot
 * @property {number} serverRam
 * @property {number} maxMoney
 * @property {number} availableMoneyOnServer
 * @property {number} percentagePerThread
 * @property {number} moneyPerThread
 * @property {number} hackTime
 * @property {number} growTime
 * @property {number} weakenTime
 * @property {number} hackChance
 * @property {number} minSecurityLevel
 * @property {number} securityLevel
 * @property {number} serverGrowth
 *
 * @property {Array<Host>} [neighboors]
 */

/**
 * @param {IGame} ns
 * @param {string} hostname
 * @returns {Host}
 */
export function getHostInfos(ns, hostname) {
  const requiredPorts = ns.getServerNumPortsRequired(hostname);

  const requiredHackingLevel = ns.getServerRequiredHackingLevel(hostname);

  const hasRoot = ns.hasRootAccess(hostname);
  const exploitable = requiredPorts <= availableExploits;

  const serverRam = ns.getServerRam(hostname)[0];
  const maxMoney = ns.getServerMaxMoney(hostname);

  const availableMoneyOnServer = ns.getServerMoneyAvailable(hostname);
  const percentagePerThread = ns.hackAnalyzePercent(hostname) / 100;
  const moneyPerThread = percentagePerThread * availableMoneyOnServer;

  const weakenTime = ns.getWeakenTime(hostname);
  const growTime = ns.getGrowTime(hostname);
  const hackTime = ns.getHackTime(hostname);

  const hackChance = ns.hackChance(hostname);

  const minSecurityLevel = ns.getServerMinSecurityLevel(hostname);
  const securityLevel = ns.getServerSecurityLevel(hostname);
  const serverGrowth = ns.getServerGrowth(hostname);

  return {
    name: hostname,
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

/**
 * @param {Host} tree
 * @returns {Array<Host> | Host}
 */
function flattenTree(tree) {
  const { neighboors, ...host } = tree;

  if (neighboors == null || neighboors.length == 0) {
    return host;
  }

  // @ts-ignore
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
 * @param {IGame} ns
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
