import { log, getArgs } from "/lib/utils.js";
import { getHosts, getHostInfos } from "/lib/scan.js";

import { JOB_SCRIPTS, FILES_TO_COPY_FOR_REMOTE_JOBS } from "/config/config.js";

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const {
    // Target to hack
    target,

    // By default, supervisor will try to grow the target as much as it can. Buy
    // specifying a moneyPerThread argument, you tell supervisor to only grow
    // the server until the amount of money per thread you specify is reached.
    moneyPerThread = false,

    // Do not try to grow the amount of money on the target
    disableGrow = false,

    // Forces a job to execute
    forceJob = false,

    // Disable logs in the terminal
    silent = false,
  } = getArgs(ns.args);

  if (target == null) {
    log(ns, "Missing target parameter.");
    return;
  }

  // Filter bots that cannot run any of our jobs
  const minimumJomRamJobRequirement = getMinJobRamRequirement(ns);

  while (true) {
    // Scan the whole network
    const hosts = getHosts(ns);

    // Consider hosts we are root in part of our botnet
    const hostsInBotnet = hosts.filter(
      (h) => h.hasRoot && h.serverRam > minimumJomRamJobRequirement
    );

    // Check if there are any hosts in our botnet that are idle
    const idleHosts = hostsInBotnet.filter((host) => !hostIsBusy(ns, host));
    if (idleHosts.length > 0) {
      // Figure out what job to give them.
      const script = getNextJobScript(ns, target, {
        forceJob,
        disableGrow,
        moneyPerThread,
      });

      // Get the job RAM requirement
      const scriptRam = ns.getScriptRam(script);

      // Send the job to each idle host
      idleHosts.forEach((host) => {
        // Compute the number of threads we can use on the host
        const threadsToUse =
          host.name !== "home"
            ? Math.floor(host.serverRam / scriptRam)
            : // Leave 8 Gigs of RAM for home
              Math.floor(host.serverRam / scriptRam) - 8;

        // Skip the node if we can't run the job
        if (threadsToUse <= 0) {
          return;
        }

        // Update all the job scripts
        ns.scp(FILES_TO_COPY_FOR_REMOTE_JOBS, "home", host.name);

        // Run the job!
        ns.exec(
          script,
          host.name,
          threadsToUse,
          `target=${target}`,
          `threads=${threadsToUse}`,
          `silent=${silent}`
        );
      });
    }

    // Check if there aren't any hosts we can exploit to grow our botnet
    const exploitableHosts = hosts.filter((h) => !h.hasRoot && h.exploitable);
    if (exploitableHosts.length > 0) {
      log(ns, "We have", exploitableHosts.length, "exploitable host(s).");
      exploitableHosts.forEach((host) => {
        // Try to exploit the node
        exploitHost(ns, host);
      });
    }

    await ns.sleep(1000);
  }
}

/**
 * @param {IGame} ns
 * @param {{ name: any; }} host
 */
function hostIsBusy(ns, host) {
  return (
    ns
      .ps(host.name)
      .find((p) => Object.values(JOB_SCRIPTS).includes(p.filename)) != null
  );
}

/**
 * @param {IGame} ns
 * @param {string} target
 * @param {{ forceJob?: string, disableGrow?: boolean, moneyPerThread?: number }} options
 */
function getNextJobScript(
  ns,
  target,
  { forceJob, disableGrow = false, moneyPerThread }
) {
  if (forceJob) {
    // @ts-ignore
    const forcedJob = JOB_SCRIPTS[forceJob.toUpperCase()];

    if (forcedJob == null) {
      log(ns, "Job", forceJob, "not found.");
      throw new Error("Job not found");
    }

    return forcedJob;
  }

  const targetInfos = getHostInfos(ns, target);

  // If the security level is not at is minimum, try to weaken the target
  if (targetInfos.securityLevel > targetInfos.minSecurityLevel + 2) {
    return JOB_SCRIPTS.WEAKEN;
  }

  if (!disableGrow) {
    // If the User specified a moneyPerThread objective, grow the money until the target is reached
    if (moneyPerThread && targetInfos.moneyPerThread < moneyPerThread) {
      return JOB_SCRIPTS.GROW;
    }

    // Otherwise, try to optimize the amount we get buy maxing the amount of money the server has
    if (
      !moneyPerThread &&
      targetInfos.availableMoneyOnServer < targetInfos.maxMoney * 0.75 &&
      !disableGrow
    ) {
      return JOB_SCRIPTS.GROW;
    }
  }

  // After we made sure our returns are acceptable, launch the hack.
  return JOB_SCRIPTS.HACK;
}

/**
 * @param {IGame} ns
 */
function getMinJobRamRequirement(ns) {
  return Object.values(JOB_SCRIPTS)
    .map((script) => ns.getScriptRam(script))
    .reduce((prev, curr) => (curr > prev ? curr : prev));
}

/**
 * @param {IGame} ns
 * @param {import("/lib/scan").Host} host
 */
function exploitHost(ns, host) {
  log(ns, "Exploiting host", host.name, "...");

  if (ns.fileExists("BruteSSH.exe")) {
    ns.brutessh(host.name);
  }

  if (ns.fileExists("FTPCrack.exe")) {
    ns.ftpcrack(host.name);
  }

  if (ns.fileExists("relaySMTP.exe")) {
    ns.relaysmtp(host.name);
  }

  if (ns.fileExists("HTTPWorm.exe")) {
    ns.httpworm(host.name);
  }

  if (ns.fileExists("SQLInject.exe")) {
    ns.sqlinject(host.name);
  }

  ns.nuke(host.name);
}
