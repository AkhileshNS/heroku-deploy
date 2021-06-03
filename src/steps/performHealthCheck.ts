
import * as core from '@actions/core';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';
import p from 'phin';
import { execSync } from 'child_process';

const delay = async (heroku: IHeroku) => {
  if (typeof heroku.delay === "number" && heroku.delay !== NaN) {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(heroku.delay * 1000);
  }
  return true;
}

const healthcheck = async (heroku: IHeroku) => {
  const res = await p(heroku.healthcheck);
  if (res.statusCode !== 200) {
    core.error(`${ansi_colors.red}Status code of network request is not 200: Status code - ${res.statusCode}`);
    return true;              
  }
  if (heroku.checkstring && heroku.checkstring !== res.body.toString()) {
    core.error(ansi_colors.red + "Failed to match the checkstring");
    return true;
  }
  core.info(res.body.toString());
  return false;
}

const rollback = (heroku: IHeroku) => {
  if (heroku.rollbackonhealthcheckfailed) {
    execSync(
      `heroku rollback --app ${heroku.app_name}`,
      heroku.appdir ? { cwd: heroku.appdir } : undefined
    );
    throw new Error(
      "Health Check Failed. Error deploying Server. Deployment has been rolled back. Please check your logs on Heroku to try and diagnose the problem"
    );
  } else {
    throw new Error(
      "Health Check Failed. Error deploying Server. Please check your logs on Heroku to try and diagnose the problem"
    );
  }
}

export const performHealthCheck = async (heroku: IHeroku): Promise<boolean> => {
  core.debug(ansi_colors.cyan + "STEP: Performing HealthCheck");
  
  if (heroku.healthcheck) {
    (await delay(heroku)) &&
    (await healthcheck(heroku)) &&
    rollback(heroku)
  }

  core.info(ansi_colors.green + "STEP: Performing HealthCheck - Success")
  return true;
}
