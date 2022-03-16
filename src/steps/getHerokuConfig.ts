import { IHeroku } from '../types';
import * as logger from '../logger.util';

// HELPER FUNCTIONS
const getEnvVar = (name: string) => {
  const element = process.env[name];
  if (element===null || element===undefined) {return "";}
  return element;
}

const formatAppdir = (appdir: string) => 
  appdir[0] === "." && appdir[1] === "/"
  ? appdir.slice(2)
  : appdir[0] === "/"
  ? appdir.slice(1)
  : appdir;

const formatDockerBuildArgs = (dockerBuildArgs: string) => {
  if (dockerBuildArgs==="") {return "";}

  return "--arg " + dockerBuildArgs
    .split("\n")
    .map((arg: string) => `${arg}="${process.env[arg]}"`)
    .join(",");
}

// RUN
export const getHerokuConfig = (): IHeroku => {
  // CONSTANTS
  const ACTION = "Getting Heroku Config";

  try {
    logger.running(ACTION);

    const heroku = {
      api_key: getEnvVar("ga_heroku_api_key"),
      email: getEnvVar("ga_heroku_email"),
      app_name: getEnvVar("ga_heroku_app_name"),
      buildpack: getEnvVar("ga_buildpack"),
      branch: getEnvVar("ga_branch"),
      dontuseforce: getEnvVar("ga_dontuseforce") === "false" ? false : true,
      dontautocreate: getEnvVar("ga_dontautocreate") === "false" ? false : true,
      usedocker: getEnvVar("ga_usedocker") === "false" ? false : true,
      dockerHerokuProcessType: getEnvVar("ga_docker_heroku_process_type"),
      dockerBuildArgs: formatDockerBuildArgs(getEnvVar("ga_docker_build_args")),
      appdir: formatAppdir(getEnvVar("ga_appdir")),
      healthcheck: getEnvVar("ga_healthcheck"),
      checkstring: getEnvVar("ga_checkstring"),
      delay: parseInt(getEnvVar("ga_delay")),
      procfile: getEnvVar("ga_procfile"),
      rollbackonhealthcheckfailed:
        getEnvVar("ga_rollbackonhealthcheckfailed") === "false" ? false : true,
      env_file: getEnvVar("ga_env_file"),
      justlogin: getEnvVar("ga_justlogin") === "false" ? false : true,
      region: getEnvVar("ga_region"),
      stack: getEnvVar("ga_stack"),
      team: getEnvVar("ga_team"),
    };

    logger.success(ACTION);
    return heroku;
  } catch (err) {
    logger.failure(ACTION);
    throw err;
  }
}