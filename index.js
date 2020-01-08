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

const defErrHandler = (successMsg, final) => (err, strout, strerr) => {
  if (err) {
    core.setFailed(strerr);
  } else {
    if (!final) {
      console.log(successMsg);
    } else {
      core.setOutput(successMsg);
    }
  }
};

try {
  // Input Variables
  let heroku = {};
  heroku.api_key = core.getInput("heroku_api_key");
  heroku.email = core.getInput("heroku_email");
  heroku.app_name = core.getInput("heroku_app_name");

  // core.setOutput('key', 'value');
  execSync(
    createCatFile(heroku),
    defErrHandler("Put login details in ~/.netrc")
  );
  execSync("heroku login", defErrHandler("Logged into heroku"));
  execSync("heroku git:remote --app " + heroku.app_name, err => {
    if (err) {
      execSync(
        "heroku create " + heroku.app_name,
        defErrHandler("Created new project with name " + heroku.app_name)
      );
    }

    execSync(
      "git push heroku HEAD:refs/heads/master",
      defErrHandler("Successfully deployed app", true)
    );
  });
} catch (error) {
  core.setFailed(error.message);
}
