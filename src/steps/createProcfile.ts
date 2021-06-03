import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import * as core from '@actions/core';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const createProcfile = (heroku: IHeroku): boolean => {
  if (heroku.procfile) {
    core.info(ansi_colors.cyan + "STEP: Creating Procfile");
    
    fs.writeFileSync(path.join(heroku.appdir, "Procfile"), heroku.procfile);
    execSync(`git add -A && git commit -m "Added Procfile"`);

    core.info(ansi_colors.green + "STEP: Creating Procfile - Success")
  }
  return true;
}
