import core from '@actions/core';
import { execSync } from 'child_process';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const configureGit = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Configuring git");

  execSync(`git config user.name "Heroku-Deploy"`);
  execSync(`git config user.email "${heroku.email}"`);
  const status = execSync("git status --porcelain").toString().trim();
  if (status) {
    execSync(
      'git add -A && git commit -m "Commited changes from previous actions"'
    );
  }

  // Check if using Docker and unshallow repo if not
  if (!heroku.usedocker) {
    // Check if Repo clone is shallow
    const isShallow = execSync(
      "git rev-parse --is-shallow-repository"
    ).toString().trim();

    // If the Repo clone is shallow, make it unshallow
    if (isShallow === "true") {
      execSync("git fetch --prune --unshallow");
    }
  }

  core.info(ansi_colors.green + "STEP: Configuring git - Success")
  return true;
}
