import { getHosts } from "/lib/scan.js";
import { log } from "/lib/utils.js";

/**
 * Kills all process on the botnet
 */
export async function main(ns) {
  const hosts = getHosts(ns).filter(
    (host) => host.hasRoot && host.name !== "home"
  );

  for (const host of hosts) {
    log(ns, "Killing scripts running on", host.name, "...");
    ns.killall(host.name);
  }

  // Kill home last
  ns.killall("home");
}
