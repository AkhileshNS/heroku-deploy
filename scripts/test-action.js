const core = require("@actions/core");
const p = require("phin");

setTimeout(() => {
  (async () => {
    try {
      const res = await p(process.argv[2]);
      const data = JSON.parse(res.body);

      if (
        data.GITHUB_RUN_ID === process.env.GITHUB_RUN_ID &&
        data.GITHUB_RUN_NUMBER === process.env.GITHUB_RUN_NUMBER &&
        data.GITHUB_REPOSITORY === process.env.GITHUB_REPOSITORY &&
        data.GITHUB_REF === process.env.GITHUB_REF
      ) {
        core.setOutput("status", "Test Success");
      } else {
        core.setFailed("Test Failed: Please check logs to see source of error");
      }
    } catch (err) {
      console.log("Error: " + err.message);
      core.setFailed("Test Failed: Please check logs to see source of error");
    }
  })();
}, 3000);
