import {join} from 'path';
import {readFile} from 'fs';
import {promisify} from 'util';
import { IHeroku } from '../types';
import { exec } from 'child_process';
import {parse} from 'dotenv';
import * as logger from '../logger.util';

// CONSTANTS
const ACTION = "Adding Configuration Variables from env and envfile";

// PROMISE-CONVERTED FUNCTIONS
const read = promisify(readFile);
const asyncExec = promisify(exec);

// HELPER FUNCTIONS
const addVarsFromEnv = (vars: string[]): string[] => {
  const res = [...vars];
  for (let key in process.env) {
    if (key.startsWith("HD_")) {
      res.push(key.substring(3) + "='" + process.env[key] + "'");
    }
  }
  return res;
}

const addVarsFromEnvFile = async (heroku: IHeroku, vars: string[]): Promise<string[]> => {
  if (heroku.env_file) {
    const env = await read(join(heroku.appdir, heroku.env_file), "utf8");
    const variables = parse(env);
    const newVars: string[] = [];
    for (let key in variables) {
      newVars.push(key + "=" + variables[key]);
    }
    return [...vars, ...newVars];
  }
  return vars;
}

// RUN
export const addConfigVars = async (heroku: IHeroku) => {
  try {
    logger.running(ACTION);
  
    const envVars = addVarsFromEnv([]);
    const configVars = await addVarsFromEnvFile(heroku, envVars);
    if (configVars.length !== 0) {
      await asyncExec(`heroku config:set --app=${heroku.app_name} ${configVars.join(" ")}`);
    }

    logger.success(ACTION);
  } catch (err) {
    logger.failure(ACTION);
    throw err;
  }
}
