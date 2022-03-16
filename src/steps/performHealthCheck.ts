

import { IHeroku } from '../types';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as logger from '../logger.util';
import p from 'phin';

// CONSTANTS
const ACTION = "Creating Procfile";

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

// HELPER FUNCTIONS
const delay = async (heroku: IHeroku) => {
  if (typeof heroku.delay === "number" && heroku.delay !== NaN) {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    await sleep(heroku.delay * 1000);
  }
}

const healthcheck = async (heroku: IHeroku) => {
  const res = await p(heroku.healthcheck);
  if (res.statusCode !== 200) {
    throw new Error(`Status code of network request is not 200: Status code - ${res.statusCode}`);         
  }
  if (heroku.checkstring && heroku.checkstring !== res.body.toString()) {
    throw new Error("Failed to match the checkstring");
  }
  console.log(res.body.toString());
}

const rollback = async (heroku: IHeroku) => {
  if (heroku.rollbackonhealthcheckfailed) {
    await asyncExec(
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

export const performHealthCheck = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);

    if (heroku.healthcheck) {
      await delay(heroku)
      await healthcheck(heroku)
    }

    logger.success(ACTION);
  } catch (err) {
    logger.failure(ACTION);
    if (heroku.healthcheck) {
      rollback(heroku)
    }
    throw err;
  }
}
