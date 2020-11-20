/**
 * Read a JSON file
 */
export function readJSONFile(ns, file) {
  return JSON.parse(ns.read(file));
}
