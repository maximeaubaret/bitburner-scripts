import { log, getArgs } from "/lib/utils.js";
import { getHosts, getHostInfos } from "/lib/scan.js";

import { JOB_SCRIPTS } from "/config/config.js";
import {
  ServerWeakenAmount,
  ServerBaseGrowthRate,
  ServerMaxGrowthRate,
} from "/config/constants.js";

const TEMPLATE = {
  HACK: 0,
  WEAKEN: 0,
  GROW: 0,
};

/**
 * @param {IGame} ns
 * @param {string} hostname
 */
function getRunningJobsForHost(ns, hostname) {
  const jobs = { ...TEMPLATE };

  const processes = ns.ps(hostname);

  processes.forEach((process) => {
    switch (process.filename) {
      case JOB_SCRIPTS.HACK:
        jobs.HACK += process.threads;
        return;

      case JOB_SCRIPTS.WEAKEN:
        jobs.WEAKEN += process.threads;
        return;

      case JOB_SCRIPTS.GROW:
        jobs.GROW += process.threads;
        return;
    }
  });

  return jobs;
}

/**
 * @param {IGame} ns
 * @param {import("../lib/scan").Host[]} hosts
 */
function getRunningJobsForHosts(ns, hosts) {
  const jobs = { ...TEMPLATE };

  for (const host of hosts) {
    const jobsForHost = getRunningJobsForHost(ns, host.name);
    jobs.HACK += jobsForHost.HACK;
    jobs.WEAKEN += jobsForHost.WEAKEN;
    jobs.GROW += jobsForHost.GROW;
  }

  return jobs;
}

/**
 * @param {IGame} ns
 */
export async function main(ns) {
  const { target, hack, weaken, grow } = getArgs(ns.args);

  const targetHost = getHostInfos(ns, String(target));

  const hosts = getHosts(ns);
  const jobs = getRunningJobsForHosts(ns, hosts);

  log(
    ns,
    "Threads",
    `hack=${jobs.HACK}`,
    `weaken=${jobs.WEAKEN}`,
    `grow=${jobs.GROW}`
  );

  log(ns, "Current values:");
  log(ns, "securityLevel=", targetHost.securityLevel);
  log(ns, "availableMoney=", targetHost.availableMoneyOnServer);

  const newSecurityLevel = computeNewSecurityLevel(
    targetHost,
    weaken ? Number(weaken) : jobs.WEAKEN
  );

  const newMoney = computeNewAvailableMoney(
    targetHost.availableMoneyOnServer,
    targetHost.securityLevel,
    targetHost.serverGrowth,
    targetHost.maxMoney,
    grow ? Number(grow) : jobs.GROW
  );

  log(ns, "Expected values after:");
  log(ns, "securityLevel=", newSecurityLevel);
  log(ns, "availableMoney=", newMoney);
}

/**
 * @param {import("/lib/scan").Host} host
 * @param {number} threads
 */
function computeNewSecurityLevel(host, threads) {
  const securityLevel = host.securityLevel - ServerWeakenAmount * threads;
  return securityLevel < host.minSecurityLevel
    ? host.minSecurityLevel
    : securityLevel;
}

/**
 * @param {number} oldAmount
 * @param {number} securityLevel
 * @param {number} serverGrowth
 * @param {number} serverMaxMoney
 * @param {number} threads
 */
function computeNewAvailableMoney(
  oldAmount,
  securityLevel,
  serverGrowth,
  serverMaxMoney,
  threads
) {
  //Server growth processed once every 450 game cycles
  const numServerGrowthCycles = Math.max(Math.floor(threads), 0);

  //Get adjusted growth rate, which accounts for server security
  const growthRate = ServerBaseGrowthRate;
  var adjGrowthRate = 1 + (growthRate - 1) / securityLevel;
  if (adjGrowthRate > ServerMaxGrowthRate) {
    adjGrowthRate = ServerMaxGrowthRate;
  }

  //Calculate adjusted server growth rate based on parameters
  const serverGrowthPercentage = serverGrowth / 100;
  const numServerGrowthCyclesAdjusted =
    numServerGrowthCycles * serverGrowthPercentage;

  //Apply serverGrowth for the calculated number of growth cycles
  let realServerGrowth = Math.pow(adjGrowthRate, numServerGrowthCyclesAdjusted);

  const newAmount = oldAmount * realServerGrowth;
  return newAmount > serverMaxMoney ? serverMaxMoney : newAmount;
}
