import { readJSONFile } from "/lib/readJSONFile.js";
import { log } from "/lib/utils.js";

import {
  BOTNET_FILE,
  ATTACK_SCRIPT,
  FILES_TO_COPY_FOR_DISTRIBUTED_ATTACK,
} from "/config/config.js";

/**
 * Distribute the attack on our botnet.
 */
export async function main(ns) {
  const botnetHosts = readJSONFile(ns, BOTNET_FILE);

  // For each member of the botnet
  botnetHosts.forEach((host) => {
    // Kill all running tasks
    ns.killall(host);

    const serverRam = ns.getServerRam(host)[0];
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
    ns.scp(FILES_TO_COPY_FOR_DISTRIBUTED_ATTACK, host);

    // Execute the script
    ns.exec(
      ATTACK_SCRIPT,
      host,
      threadsToUse,
      ...[...ns.args, `threads=${threadsToUse}`]
    );
  });
}
