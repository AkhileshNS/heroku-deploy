const core = require("@actions/core");
const { execSync } = require("child_process");

// Support Functions
const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

// Input Variables
let heroku = {};
heroku.api_key = core.getInput("heroku_api_key");
heroku.email = core.getInput("heroku_email");
heroku.app_name = core.getInput("heroku_app_name");
heroku.buildpack = core.getInput("buildpack");
heroku.branch = core.getInput("branch");

try {
  execSync(createCatFile(heroku));
  console.log("Created and wrote to ~./netrc");
  execSync("heroku login");
  console.log("Successfully logged into heroku");

  try {
    execSync("heroku git:remote --app " + heroku.app_name);
    console.log("Added git remote heroku");
  } catch (err) {
    execSync(
      "heroku create " +
        heroku.app_name +
        (heroku.buildpack ? " --buildpack " + heroku.buildpack : "")
    );
    console.log("Successfully created a new heroku app");
  }

  execSync(`git push heroku HEAD:refs/heads/${heroku.branch}`);
  core.setOutput("status", "Successfully deployed heroku app");
} catch (err) {
  core.setFailed(err.toString());
}
