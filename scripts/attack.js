import { getArgs, formatBigNumber, log, formatTime } from "utils.js";

/**
 * Attacks a given target.
 *
 * Arguments:
 *    - target: target to attack
 *    - options:
 */
export async function main(ns) {
  const target = ns.args[0];
  const options = getArgs(ns.args.slice(1));

  while (true) {
    await attack(ns, target, options);
  }
}

async function attack(ns, target, options) {
  const { threads = 1 } = options;

  const hackChance = ns.hackChance(target);
  const hackChanceThreshold = 0.8;

  const weakenTime = ns.getWeakenTime(target);
  const growTime = ns.getGrowTime(target);
  const hackTime = ns.getHackTime(target);

  const availableMoneyOnServer = ns.getServerMoneyAvailable(target);
  const percentagePerThread = ns.hackAnalyzePercent(target);
  const moneyPerThread = percentagePerThread * availableMoneyOnServer;

  const moneyPerThreadThreshold = 1000000;

  // Weaken the target until we have satisfactory chances of success
  // for our hacks.
  if (hackChance < hackChanceThreshold) {
    log(
      ns,
      `Weakening target "${target}" (hackChance=${hackChance.toFixed(
        4
      )}, hackChanceThreshold=${hackChanceThreshold}, weakenTime=${formatTime(
        weakenTime
      )})...`
    );
    return ns.weaken(target, { threads });
  }

  // Make sure there is enough money on the target to make it worthwhile
  if (moneyPerThread < moneyPerThreadThreshold) {
    log(
      ns,
      `Growing target "${target}" (moneyPerThread=${formatBigNumber(
        moneyPerThread
      )}, moneyPerThreadThreshold=${formatBigNumber(
        moneyPerThreadThreshold
      )}, growTime=${formatTime(growTime)})...`
    );
    return ns.grow(traget, { threads });
  }

  // Otherwise, we're ready to attack.
  log(ns, `Attacking target "${target}" (hackTime=${formatTime(hackTime)})...`);
  const stolenMoney = await ns.hack(target, { threads });
  log(ns, `Stole ${formatBigNumber(stolenMoney)}$ from target "${target}".`);
}
