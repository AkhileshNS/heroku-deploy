const { execSync } = require("child_process");

(async () => {
  try {
    const res = execSync("git status");
    console.log(res.toString());
  } catch (err) {
    console.log(err.stderr.toString());
  }
})();
