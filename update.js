const SERVER =
  "https://raw.githubusercontent.com/maximeaubaret/bitburner-scripts/master";

const FILES = [
  "lib/readJSONFile.js",
  "lib/utils.js",
  "scripts/attack.js",
  "scripts/distribute.js",
  "config.js",
];

export async function main(ns) {
  for (const file of FILES) {
    const status = await ns.wget(
      `${SERVER}/${file}?cache=${Math.random()}`,
      "/" + file
    );
    ns.tprint(`${file}: ${status ? "Success" : "Failure"}`);
  }
}
