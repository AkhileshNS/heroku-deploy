import {exec} from 'child_process';
import {writeFile} from 'fs';
import {join} from 'path';
import { promisify } from 'util';
import * as logger from '../logger.util';
import { IHeroku } from '../types';

// CONSTANTS
const ACTION = "Creating Procfile";

// PROMISE-CONVERTED FUNCTIONS
const write = promisify(writeFile);
const asyncExec = promisify(exec);

export const createProcfile = async (heroku: IHeroku) => {
  try {
    if (heroku.procfile) {
      logger.running(ACTION);

      // PIPELINE
      /* STEP */ await write(join(heroku.appdir, "Procfile"), heroku.procfile, "utf-8");
      /* STEP */ await asyncExec(`git add -A && git commit -m "Added Procfile"`);

      logger.success(ACTION);
    }
  } catch (err) {
    logger.failure(ACTION);
    throw err;
  }
}
