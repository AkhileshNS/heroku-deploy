import * as logger from '../logger.util';
import { exec } from 'child_process';
import { IHeroku } from '../types';
import { promisify } from 'util';

// CONSTANTS
const ACTION = "Adding Remote";  

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

// RUN
export const addRemote = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);
    await asyncExec("heroku git:remote --app " + heroku.app_name);
  } catch (err) {
    if (heroku.dontautocreate) {
      logger.failure(ACTION);
      throw err;
    }

    try {
      await asyncExec(
        "heroku create " +
          heroku.app_name +
          (heroku.buildpack ? " --buildpack " + heroku.buildpack : "") +
          (heroku.region ? " --region " + heroku.region : "") +
          (heroku.stack ? " --stack " + heroku.stack : "") +
          (heroku.team ? " --team " + heroku.team : "")
      );
    } catch (err) {
      logger.failure(ACTION);
      throw err;
    }
  }

  logger.success(ACTION);
}
