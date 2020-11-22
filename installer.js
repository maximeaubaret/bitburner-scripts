const FILES = [
  "/config/config.js",
  "/config/constants.js",
  "/lib/purchaseServer.js",
  "/lib/scan.js",
  "/lib/utils.js",
  "/scripts/findTarget.js",
  "/scripts/getScriptRam.js",
  "/scripts/job.grow.js",
  "/scripts/job.hack.js",
  "/scripts/job.weaken.js",
  "/scripts/killAll.js",
  "/scripts/purchaseServers.js",
  "/scripts/sellServers.js",
  "/scripts/scan.js",
  "/scripts/supervisor.js",
  "/scripts/tree.js",
  "/scripts/test.js",
];

const DEFAULT_SERVER =
  "https://raw.githubusercontent.com/maximeaubaret/bitburner-scripts/master";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  // If any argument is "--uninstall", uninstall all the scripts
  if (ns.args.find((arg) => arg === "--uninstall") != null) {
    return await uninstall(ns);
  }

  // Install
  await install(ns);
}

/**
 * @param {IGame} ns
 */
async function install(ns) {
  const server = ns.args[0] || DEFAULT_SERVER;

  for (const file of FILES) {
    const status = await ns.wget(`${server}${file}`, file);
    ns.tprint(`${file}: ${status ? "✅" : "❌"}`);
  }
}

/**
 * @param {IGame} ns
 */
async function uninstall(ns) {
  if (!(await ns.prompt("Are you sure you want to uninstall?"))) {
    ns.tprint("Aborting...");
    return;
  }

  for (const file of FILES) {
    const status = await ns.rm(file);
    ns.tprint(`Deleting ${file}: ${status ? "✅" : "❌"}`);
  }
}
