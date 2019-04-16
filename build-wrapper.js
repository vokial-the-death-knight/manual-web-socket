const path = require("path");
const fs = require("fs");

if (!fs.existsSync(path.resolve(__dirname, "tmp", "manual-web-socket.js"))) {
  throw new Error("Build typescript part first!");
}

const script = fs.readFileSync(
  path.resolve(__dirname, "tmp", "manual-web-socket.js"),
  "utf8"
);

if (!fs.existsSync(path.resolve(__dirname, "dist"))) {
  fs.mkdirSync(path.resolve(__dirname, "dist"));
}

const template = "module.exports = { getScript: `" + script + "` }";

fs.writeFileSync(
  path.resolve(__dirname, "dist", "manual-web-socket.js"),
  template
);
