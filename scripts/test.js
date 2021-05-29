const { execSync } = require("child_process");

(async () => {
  try {
    const res = execSync("git rev-parse --is-shallow-repository");
    console.log("false" === res.toString().trim());
  } catch (err) {
    console.log(err.stderr.toString());
  }
})();
