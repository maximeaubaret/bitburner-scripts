// @ts-check

import { getHosts } from "/lib/scan.js";
import { log } from "/lib/utils.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const hosts = getHosts(ns);

  const hostsToExploit = hosts.filter((h) => h.exploitable && !h.hasRoot);

  log(ns, "You can exploit", hostsToExploit.length, "host(s).");
  hostsToExploit.forEach((host) => {
    log(ns, "-", host.name);
  });
}
