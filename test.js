const { execSync } = require("child_process");

try {
  const res = execSync("git rev-parse --is-shallow-repository").toString();
  console.log({ isShallow: res === "true\n" });
} catch (err) {
  console.log({ err });
}
