const fs = require("fs");
const path = require("path");

const root = process.cwd();
const schemaUtilsNodeModules = path.join(root, "node_modules", "schema-utils", "node_modules");
const hoistedAjvKeywords = path.join(root, "node_modules", "ajv-keywords");
const localAjvKeywords = path.join(schemaUtilsNodeModules, "ajv-keywords");

function exists(target) {
  try {
    fs.accessSync(target);
    return true;
  } catch {
    return false;
  }
}

if (!exists(schemaUtilsNodeModules) || !exists(hoistedAjvKeywords)) {
  process.exit(0);
}

if (!exists(localAjvKeywords)) {
  fs.cpSync(hoistedAjvKeywords, localAjvKeywords, { recursive: true });
  process.stdout.write("Repaired schema-utils ajv-keywords peer layout.\n");
}
