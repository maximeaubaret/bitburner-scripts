import { getArgs, formatBigNumber, log, formatTime } from "/lib/utils.js";

/**
 * Attacks a given target.
 *
 * Arguments:
 *    - target: target to attack
 *    - options:
 *        moneyPerThreadThreshold
 */
export async function main(ns) {
  const target = ns.args[0];
  const options = getArgs(ns.args.slice(1));

  if (target == null) {
    log(ns, "Missing parameter target.");
    return;
  }

  while (true) {
    await attack(ns, target, options);
  }
}

async function attack(ns, target, options) {
  const {
    threads = 1,
    moneyPerThreadThreshold = 5000,
    hackChanceThreshold = 0.8,
    silent = false,
  } = options;

  const hackChance = ns.hackChance(target);

  const weakenTime = ns.getWeakenTime(target);
  const growTime = ns.getGrowTime(target);
  const hackTime = ns.getHackTime(target);

  const availableMoneyOnServer = ns.getServerMoneyAvailable(target);
  const percentagePerThread = ns.hackAnalyzePercent(target) / 100;
  const moneyPerThread = percentagePerThread * availableMoneyOnServer;

  // Weaken the target until we have satisfactory chances of success
  // for our hacks.
  if (hackChance < hackChanceThreshold) {
    !silent &&
      log(
        ns,
        `Weakening target "${target}" (hackChance=${hackChance.toFixed(
          4
        )}, hackChanceThreshold=${hackChanceThreshold}, weakenTime=${formatTime(
          weakenTime
        )}, threads=${threads})...`
      );
    return ns.weaken(target, { threads });
  }

  // Make sure there is enough money on the target to make it worthwhile
  if (moneyPerThread < moneyPerThreadThreshold) {
    !silent &&
      log(
        ns,
        `Growing target "${target}" (moneyPerThread=${formatBigNumber(
          moneyPerThread
        )}, moneyPerThreadThreshold=${formatBigNumber(
          moneyPerThreadThreshold
        )}, growTime=${formatTime(growTime)}, threads=${threads})...`
      );
    return ns.grow(target, { threads });
  }

  // Otherwise, we're ready to attack.
  !silent &&
    log(
      ns,
      `Attacking target "${target}" (hackTime=${formatTime(
        hackTime
      )},moneyPerThread=${moneyPerThread}, threads=${threads})...`
    );

  const stolenMoney = await ns.hack(target, { threads });
  log(ns, `Stole ${formatBigNumber(stolenMoney)}$ from target "${target}".`);
}
