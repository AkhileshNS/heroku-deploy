
import core from '@actions/core';
import { execSync } from 'child_process';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const addRemote = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Adding Remote");
  
  try {
    execSync("heroku git:remote --app " + heroku.app_name);
    core.debug("Added git remote heroku");
  } catch (err) {
    if (heroku.dontautocreate) {
      throw err;
    }

    execSync(
      "heroku create " +
        heroku.app_name +
        (heroku.buildpack ? " --buildpack " + heroku.buildpack : "") +
        (heroku.region ? " --region " + heroku.region : "") +
        (heroku.stack ? " --stack " + heroku.stack : "") +
        (heroku.team ? " --team " + heroku.team : "")
    );
  }

  core.info(ansi_colors.green + "STEP: Adding Remote - Success")
  return true;
}
