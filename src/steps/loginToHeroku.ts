import { ansi_colors } from '../util';
import { IHeroku } from '../types';
import core from '@actions/core';
import { execSync } from 'child_process';

const createCatFile = ({ email, api_key }: IHeroku) => `cat >~/.netrc <<EOF
machine api.heroku.com
    login ${email}
    password ${api_key}
machine git.heroku.com
    login ${email}
    password ${api_key}
EOF`;

export const loginToHeroku = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Login to Heroku");
  execSync(createCatFile(heroku));
  core.info(ansi_colors.green + "STEP: Login to Heroku - Success")
  return true;
}