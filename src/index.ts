import * as core from '@actions/core';
import * as steps from './steps';

(async () => {
  try {
    const heroku = steps.getHerokuConfig();

    // Pipeline
    steps.loginToHeroku(heroku) &&
    steps.justLogin(heroku) &&
    steps.configureGit(heroku) &&
    steps.createProcfile(heroku) &&
    steps.addRemote(heroku) &&
    steps.addConfigVars(heroku) &&
    steps.deploy(heroku) &&
    (await steps.performHealthCheck(heroku))

    core.setOutput(
      "status",
      "Successfully deployed heroku app from branch " + heroku.branch
    );
  } catch (error) {
    core.setFailed(error);
  }
})();