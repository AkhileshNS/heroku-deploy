import { IHeroku } from '../types';
import { promisify } from 'util';
import * as logger from '../logger.util';
import {exec} from 'child_process';

// CONSTANTS
const ACTION = "Creating Procfile";

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

const createCatFile = ({ email, api_key }: IHeroku) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

export const loginToHeroku = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);

    await asyncExec(createCatFile(heroku));
    if (heroku.usedocker) {
      await asyncExec("heroku container:login");
    }

    logger.success(ACTION);
  } catch (err) {
    logger.failure(ACTION);
    throw err;
  }
}