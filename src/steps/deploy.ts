import * as logger from '../logger.util';
import { exec } from 'child_process';
import { IHeroku } from '../types';
import { promisify } from 'util';

// CONSTANTS
const ACTION = "Deploying";
const SKIPPED_WRONG_BRANCH = "Pushed to branch other than [main, master], skipping build";

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

// HELPER FUNCTIONS
const deployDocker = async (heroku: IHeroku) => {
  if (heroku.usedocker) {
    await asyncExec(
      `heroku container:push ${heroku.dockerHerokuProcessType} --app ${heroku.app_name} ${heroku.dockerBuildArgs}`,
      heroku.appdir ? { cwd: heroku.appdir } : undefined
    );
    await asyncExec(
      `heroku container:release ${heroku.dockerHerokuProcessType} --app ${heroku.app_name}`,
      heroku.appdir ? { cwd: heroku.appdir } : undefined
    );
  }
}

const fixRemoteBranch = async (heroku: IHeroku) => {
  let remote_branch = await asyncExec(
    "git remote show heroku | grep 'HEAD' | cut -d':' -f2 | sed -e 's/^ *//g' -e 's/ *$//g'"
  ).toString().trim();

  if (remote_branch === "master") {
    await asyncExec("heroku plugins:install heroku-repo");
    await asyncExec("heroku repo:reset -a " + heroku.app_name);
  }
} 

const deployGit = async (heroku: IHeroku, shouldThrowError = false) => {
  const force = !heroku.dontuseforce ? "--force" : ""
  const finalBranch = heroku.appdir  
    ? `\`git subtree split --prefix=${heroku.appdir} ${heroku.branch}\``
    : heroku.branch
  try {
    const output = await asyncExec(
      `git push ${force} heroku ${finalBranch}:refs/head/main`, 
      { maxBuffer: 104857600 }
    ).toString();
    if (output.toLowerCase().includes(SKIPPED_WRONG_BRANCH)) {
      throw new Error(`
        Unable to deploy code because the deployed branch is not 'main' or 'master' 
        (Heroku only allows this branch to be deployed)
      `);
    }
  } catch (err) {
    if (shouldThrowError) {
      throw err;
    } else {
      console.error(
        "stderr" in err 
        ? err.stderr.toString()
        : err.message.toString()
      );
    }
  }
}

// RUN
export const deploy = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);

    // PIPELINE
    /* STEP */ await deployDocker(heroku) 
    /* STEP */ await fixRemoteBranch(heroku) 
    /* STEP */ await deployGit({...heroku, dontuseforce: false}) 
    /* STEP */ await deployGit(heroku, true)

    logger.success(ACTION);
  } catch (err) {
    logger.failure(ACTION);
    throw err;
  }
}
