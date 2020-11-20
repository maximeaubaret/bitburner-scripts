import { BOTNET_FILE, ATTACK_SCRIPT } from "config.js";
import { readJSONFile } from "readJSONFile.js";
import { log } from "utils.js";

/**
 * Distribute the attack on our botnet.
 */
export async function main(ns) {
  const botnetHosts = readJSONFile(ns, BOTNET_FILE);

  // For each member of the botnet
  botnetHosts.forEach((host) => {
    // Kill all running tasks
    ns.killall(host);

    const serverRam = ns.getServerRam(server)[0];
    const scriptRam = ns.getScriptRam(ATTACK_SCRIPT);

    const threadsToUse = Math.floor(serverRam / scriptRam);

    if (threadsToUse <= 0) {
      log(
        ns,
        `Skipping host ${host} because the calculated thread count is equals to 0.`
      );
      return;
    }

    // Update the script on the host
    ns.scp(ATTACK_SCRIPT, host);

    // Execute the script
    ns.exec(ATTACK_SCRIPT, host, 1, ns.args);
  });
}
