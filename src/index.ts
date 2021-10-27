import {exec} from 'child_process';
import {promisify} from 'util';

const asyncExec = promisify(exec);

(async () => {
  try {
    console.log((await asyncExec("heroku --version")).stdout);
  } catch (err) {
    console.log(err);
  }
})()