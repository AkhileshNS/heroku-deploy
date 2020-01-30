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
heroku.dontuseforce = core.getInput("dontuseforce");
heroku.useDocker = core.getInput("useDocker"); 

try {
  //execSync("git fetch --prune --unshallow");
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
    
  function deploy(useForce) {
        
        const force = useForce? " --force": ""; 
      
        if (useDocker) {
            
            execSync("heroku container:push web" + force); 
            execSynd("heroku container:release web" + force);
        } else {
            
            execSync(`git push heroku ${heroku.branch}:master` + force); 
        }
  }

  try {
    
      deploy(false);   
  } catch (err) {
    
      LLconsole.log(
        "Unable to push branch because the branch is behind the deployed branch. Using --force to deploy branch. (If you want to avoid this, set dontuseforce to 1 in with: of .github/workflows/action.yml"
      );
      
    deploy(!heroku.dontUseForce);
  }
  core.setOutput(
    "status",
    "Successfully deployed heroku app from branch " + heroku.branch
  );
} catch (err) {
  core.setFailed(err.toString());
}
