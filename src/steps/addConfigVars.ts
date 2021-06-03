
import * as core from '@actions/core';
import path from 'path';
import fs from 'fs';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';
import { execSync } from 'child_process';

const addVarsFromEnv = (vars: string[]): string[] => {
  const res = [...vars];
  for (let key in process.env) {
    if (key.startsWith("HD_")) {
      res.push(key.substring(3) + "='" + process.env[key] + "'");
    }
  }
  return res;
}

const addVarsFromEnvFile = (heroku: IHeroku, vars: string[]): string[] => {
  if (heroku.env_file) {
    const env = fs.readFileSync(path.join(heroku.appdir, heroku.env_file), "utf8");
    const variables = require("dotenv").parse(env);
    const newVars: string[] = [];
    for (let key in variables) {
      newVars.push(key + "=" + variables[key]);
    }
    return [...vars, ...newVars];
  }
  return vars;
}

export const addConfigVars = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: Adding Configuration Variables from env and envfile");
  
  const envVars = addVarsFromEnv([]);
  const configVars = addVarsFromEnvFile(heroku, envVars);
  if (configVars.length !== 0) {
    execSync(`heroku config:set --app=${heroku.app_name} ${configVars.join(" ")}`);
  }

  core.info(ansi_colors.green + "STEP: Adding Configuration Variables from env and envfile - Success")
  return true;
}
