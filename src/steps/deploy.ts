
import * as core from '@actions/core';
import { execSync } from 'child_process';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const deployDocker = (heroku: IHeroku) => {
  if (heroku.usedocker) {
    execSync(
      `heroku container:push ${heroku.dockerHerokuProcessType} --app ${heroku.app_name} ${heroku.dockerBuildArgs}`,
      heroku.appdir ? { cwd: heroku.appdir } : undefined
    );
    execSync(
      `heroku container:release ${heroku.dockerHerokuProcessType} --app ${heroku.app_name}`,
      heroku.appdir ? { cwd: heroku.appdir } : undefined
    );
    return false;
  }
  return true;
}

export const fixRemoteBranch = (heroku: IHeroku) => {
  let remote_branch = execSync(
    "git remote show heroku | grep 'HEAD' | cut -d':' -f2 | sed -e 's/^ *//g' -e 's/ *$//g'"
  )
    .toString()
    .trim();

  if (remote_branch === "master") {
    execSync("heroku plugins:install heroku-repo");
    execSync("heroku repo:reset -a " + heroku.app_name);
  }
  return true;
} 

export const deployGit = (heroku: IHeroku, shouldThrowError = false) => {
  const force = !heroku.dontuseforce ? "--force" : ""
  const finalBranch = heroku.appdir  
    ? `\`git subtree split --prefix=${heroku.appdir} ${heroku.branch}\``
    : heroku.branch
  try {
    execSync(`git push ${force} heroku ${finalBranch}:refs/head/main`, { maxBuffer: 104857600 });
  } catch (err) {
    if (shouldThrowError) {
      throw err;
    } else {
      core.error(ansi_colors.red + (
        "stderr" in err 
        ? err.stderr.toString()
        : err.message.toString()
      ));
      return true;
    }
  }
  return false;
}

export const deploy = (heroku: IHeroku): boolean => {
  core.info(ansi_colors.cyan + "STEP: Deploying");

  deployDocker(heroku) &&
  fixRemoteBranch(heroku) &&
  deployGit({...heroku, dontuseforce: false}) &&
  deployGit(heroku, true)

  core.info(ansi_colors.green + "STEP: Deploying - Success")
  return true;
}
