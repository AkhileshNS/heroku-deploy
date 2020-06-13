const fs = require("fs");

const data = {
  GITHUB_RUN_ID: process.env.GITHUB_RUN_ID,
  GITHUB_RUN_NUMBER: process.env.GITHUB_RUN_NUMBER,
  GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY,
  GITHUB_REF: process.env.GITHUB_REF,
};

fs.writeFileSync(process.argv[2], JSON.stringify(data));
