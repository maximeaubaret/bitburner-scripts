const SERVER = "http://localhost:5000/";
const FILES = [
  "lib/readJSONFile.js",
  "lib/utils.js",
  "scripts/attack.js",
  "scripts/distribute.js",
  "config.js",
];

export async function main(ns) {
  for (const file of FILES) {
    const status = ns.wget(`${SERVER}${file}`, file);
    ns.tprint(`${file}: ${status ? "Success" : "Failure"}`);
  }
}
