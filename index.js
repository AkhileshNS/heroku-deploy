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

const deploy = ({
  dontuseforce,
  app_name,
  branch,
  usedocker,
  dockerHerokuProcessType,
  appdir,
}) => {
  const force = !dontuseforce ? "--force" : "";

  if (usedocker) {
    execSync(
      `heroku container:push ${dockerHerokuProcessType} --app ${app_name}`,
      appdir ? { cwd: appdir } : null
    );
    execSync(
      `heroku container:release ${dockerHerokuProcessType} --app ${app_name}`,
      appdir ? { cwd: appdir } : null
    );
  } else {
    if (appdir === "") {
      execSync(`git push heroku ${branch}:refs/heads/master ${force}`);
    } else {
      const Appdir =
        appdir[0] === "." && appdir[1] === "/"
          ? appdir.slice(2)
          : appdir[0] === "/"
          ? appdir.slice(1)
          : appdir;

      execSync(
        `git push ${force} heroku \`git subtree split --prefix=${Appdir} ${branch}\`:refs/heads/master`
      );
    }
  }
};

const addRemote = ({ app_name, buildpack }) => {
  try {
    execSync("heroku git:remote --app " + app_name);
    console.log("Added git remote heroku");
  } catch (err) {
    execSync(
      "heroku create " +
        app_name +
        (buildpack ? " --buildpack " + buildpack : "")
    );
    console.log("Successfully created a new heroku app");
  }
};

const addConfig = ({ app_name }) => {
  const configVars = [];
  for (let key in process.env) {
    if (key.startsWith("HEROKU_")) {
      configVars.push(key + "=" + process.env[key]);
    }
  }
  if (configVars.length !== 0) {
    execSync(`heroku config:set --app=${app_name} ${configVars.join(" ")}`);
  }
};

// Input Variables
let heroku = {};
heroku.api_key = core.getInput("heroku_api_key");
heroku.email = core.getInput("heroku_email");
heroku.app_name = core.getInput("heroku_app_name");
heroku.buildpack = core.getInput("buildpack");
heroku.branch = core.getInput("branch");
heroku.dontuseforce = core.getInput("dontuseforce") === "true" ? true : false;
heroku.usedocker = core.getInput("usedocker") === "true" ? true : false;
heroku.dockerHerokuProcessType = core.getInput("docker_heroku_process_type");
heroku.appdir = core.getInput("appdir");

// Program logic
try {
  // Check if using Docker
  if (!heroku.usedocker) {
    // Check if Repo clone is shallow
    const isShallow = execSync(
      "git rev-parse --is-shallow-repository"
    ).toString();

    // If the Repo clone is shallow, make it unshallow
    if (isShallow === "true\n") {
      execSync("git fetch --prune --unshallow");
    }
  }

  execSync(createCatFile(heroku));
  console.log("Created and wrote to ~./netrc");

  execSync("heroku login");
  if (heroku.usedocker) {
    execSync("heroku container:login");
  }
  console.log("Successfully logged into heroku");

  addRemote(heroku);
  addConfig(heroku);

  try {
    deploy({ ...heroku, dontuseforce: true });
  } catch (err) {
    console.error(`
            Unable to push branch because the branch is behind the deployed branch. Using --force to deploy branch. 
            (If you want to avoid this, set dontuseforce to 1 in with: of .github/workflows/action.yml. 
            Specifically, the error was: ${err}
        `);

    deploy(heroku);
  }

  core.setOutput(
    "status",
    "Successfully deployed heroku app from branch " + heroku.branch
  );
} catch (err) {
  core.setFailed(err.toString());
}
