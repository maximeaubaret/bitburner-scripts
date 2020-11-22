import { getHosts } from "/lib/scan.js";
import { getArgs, log, formatBigNumber, formatTime } from "/lib/utils.js";

export async function main(ns) {
  const { showAll = false, host = null, top = 5 } = getArgs(ns.args);

  let hosts = getHosts(ns).filter((h) => h.name !== "home");

  if (host == null) {
    hosts = sortBy(hosts, "requiredHackingLevel").reverse();

    if (!showAll) {
      hosts = hosts.filter((h) => h.moneyPerThread != 0);
    }
  } else {
    hosts = hosts.filter((h) => h.name === host);
  }

  hosts = hosts.slice(0, top);

  hosts.forEach((host) => {
    log(ns, `${host.status} [${host.name}]`);
    log(ns, `  - Required hacking level`, host.requiredHackingLevel);
    log(ns, `  - Money`, formatBigNumber(host.availableMoneyOnServer));
    log(ns, `  - Max Money`, formatBigNumber(host.maxMoney));
    log(
      ns,
      `  - Money stolen per thread`,
      formatBigNumber(host.moneyPerThread)
    );
    log(ns, `  - Hack chance`, host.hackChance.toFixed(2));
    log(ns, `  - Hack time`, formatTime(host.hackTime));
    log(ns, `  - Grow time`, formatTime(host.growTime));
    log(ns, `  - Weaken time`, formatTime(host.weakenTime));
    log(ns, `  - Security level`, host.securityLevel.toFixed(2));
    log(ns, `  - Min security level`, host.minSecurityLevel);
    log(ns);
  });
}

function sortBy(array, key) {
  return array.sort((a, b) => {
    return a[key] - b[key];
  });
}
