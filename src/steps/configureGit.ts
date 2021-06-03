import * as core from '@actions/core';
import { execSync } from 'child_process';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

const configureUserAndCommit = (heroku: IHeroku): boolean => {
  execSync(`git config user.name "Heroku-Deploy"`);
  execSync(`git config user.email "${heroku.email}"`);
  if (execSync("git status --porcelain").toString().trim()) {
    execSync(
      'git add -A && git commit -m "Commited changes from previous actions"'
    );
  }
  return true;
}

const unshallowRepo = (heroku: IHeroku): boolean => {
  if (heroku.usedocker) {
    return true;
  }
  if (execSync("git rev-parse --is-shallow-repository").toString().trim()==="true") {
    execSync("git fetch --prune --unshallow");
  }
  return true;
}

export const configureGit = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Configuring git");

  configureUserAndCommit(heroku) &&
  unshallowRepo(heroku)

  core.info(ansi_colors.green + "STEP: Configuring git - Success")
  return true;
}
