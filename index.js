const core = require("@actions/core");
const Exec = require("await-exec");
const { exec } = require("child_process");

// Support Functions
const createCatFile = ({ email, api_key }) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

(async () => {
  try {
    // Input Variables
    let heroku = {};
    heroku.api_key = core.getInput("heroku_api_key");
    heroku.email = core.getInput("heroku_email");
    heroku.app_name = core.getInput("heroku_app_name");

    await Exec(createCatFile(heroku));
    console.log("Create and write to ~./netrc");

    await Exec("heroku login");
    console.log("Successfully logged into heroku");

    exec("heroku git:remote --app " + heroku.app_name, async err => {
      try {
        if (err) {
          await Exec("heroku create " + heroku.app_name);
          console.log("Successfully created a new heroku app");
        }

        await Exec("git push heroku HEAD:refs/heads/master");
        console.log("Successfully deployed heroku app");
      } catch (err) {
        core.setFailed(err);
      }
    });
  } catch (err) {
    core.setFailed(err);
  }
})();
