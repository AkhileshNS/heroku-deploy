const core = require("@actions/core");
const https = require("https");

https
  .get(process.argv[2], (resp) => {
    let rawData = "";

    // A chunk of data has been recieved.
    resp.on("data", (chunk) => {
      rawData += chunk;
    });

    // The whole response has been received. Print out the result.
    resp.on("end", () => {
      console.log(rawData);
      let data;
      if (!rawData.includes("<body>")) {
        data = JSON.parse(rawData);
      } else {
        data = JSON.parse(rawData.split("<body>")[1].split("</body>")[0]);
      }

      if (
        data.GITHUB_RUN_ID === process.env.GITHUB_RUN_ID &&
        data.GITHUB_RUN_NUMBER === process.env.GITHUB_RUN_NUMBER &&
        data.GITHUB_REPOSITORY === process.env.GITHUB_REPOSITORY &&
        data.GITHUB_REF === process.env.GITHUB_REF
      ) {
        core.setOutput("status", "Test Success");
      }
    });
  })
  .on("error", (err) => {
    console.log("Error: " + err.message);
    core.setFailed("Test Failed: Please check logs to see source of error");
  });
