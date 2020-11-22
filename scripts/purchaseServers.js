import { purchaseServer } from "/lib/purchaseServer.js";
import { log, getArgs } from "/lib/utils.js";

export async function main(ns) {
  const { ram = 8 } = getArgs(ns.args);

  // Buy as much server as we can
  let didBuy = false;
  do {
    didBuy = await purchaseServer(ns, ram);
    if (didBuy) {
      log(ns, "Bought a server.");
    } else {
      log(ns, "Dit not buy a server.");
    }
    await ns.sleep(250);
  } while (didBuy);
}
