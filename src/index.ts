// IMPORTS
import {exec} from 'child_process';
import {promisify} from 'util';
import * as steps from './steps';

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

// RUN
(async () => {
  try {
    // PIPELINE
    /* STEP */ const heroku = steps.getHerokuConfig();
    /* STEP */ console.log(heroku);
  } catch (err) {
    console.error(err);
  }
})()