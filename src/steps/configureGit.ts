import * as logger from '../logger.util';
import { exec } from 'child_process';
import { IHeroku } from '../types';
import { promisify } from 'util';

// CONSTANTS
const ACTION = "Configuring git";

// PROMISE-CONVERTED FUNCTIONS
const asyncExec = promisify(exec);

// HELPER FUNCTIONS
const configureUserAndCommit = async (heroku: IHeroku) => {
  await asyncExec(`git config user.name "Heroku-Deploy"`);
  await asyncExec(`git config user.email "${heroku.email}"`);
  if (await asyncExec("git status --porcelain").toString().trim()) {
    await asyncExec(
      'git add -A && git commit -m "Commited changes from previous actions"'
    );
  }
}

const unshallowRepo = async (heroku: IHeroku) => {
  if (heroku.usedocker) {
    return;
  }
  if (await asyncExec("git rev-parse --is-shallow-repository").toString().trim()==="true") {
    await asyncExec("git fetch --prune --unshallow");
  }
}

// RUN
export const configureGit = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);

    // PIPELINES
    /* STEP */ await configureUserAndCommit(heroku)
    /* STEP */ await unshallowRepo(heroku)

    logger.success(ACTION);
  } catch (err) {
    logger.failure(ACTION);
  }
}
