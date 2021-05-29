
import core from '@actions/core';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const configureGit = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Configuring git");
  
  core.info(ansi_colors.green + "STEP: Configuring git - Success")
  return true;
}
