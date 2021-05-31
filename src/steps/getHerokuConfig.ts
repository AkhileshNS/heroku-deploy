import core from '@actions/core';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

const formatAppdir = (appdir: string) => 
  appdir[0] === "." && appdir[1] === "/"
  ? appdir.slice(2)
  : appdir[0] === "/"
  ? appdir.slice(1)
  : appdir;

const formatDockerBuildArgs = (dockerBuildArgs: string) => {
  const res = dockerBuildArgs
    .split("\n")
    .map((arg: string) => `${arg}="${process.env[arg]}"`)
    .join(",");
  return res ? "--arg " + res : ""
}

export const getHerokuConfig = (): IHeroku => {
  core.debug(ansi_colors.cyan + "STEP: Getting Heroku Config")

  const heroku = {
    api_key: core.getInput("heroku_api_key"),
    email: core.getInput("heroku_email"),
    app_name: core.getInput("heroku_app_name"),
    buildpack: core.getInput("buildpack"),
    branch: core.getInput("branch"),
    dontuseforce: core.getInput("dontuseforce") === "false" ? false : true,
    dontautocreate: core.getInput("dontautocreate") === "false" ? false : true,
    usedocker: core.getInput("usedocker") === "false" ? false : true,
    dockerHerokuProcessType: core.getInput("docker_heroku_process_type"),
    dockerBuildArgs: formatDockerBuildArgs(core.getInput("docker_build_args")),
    appdir: formatAppdir(core.getInput("appdir")),
    healthcheck: core.getInput("healthcheck"),
    checkstring: core.getInput("checkstring"),
    delay: parseInt(core.getInput("delay")),
    procfile: core.getInput("procfile"),
    rollbackonhealthcheckfailed:
      core.getInput("rollbackonhealthcheckfailed") === "false" ? false : true,
    env_file: core.getInput("env_file"),
    justlogin: core.getInput("justlogin") === "false" ? false : true,
    region: core.getInput("region"),
    stack: core.getInput("stack"),
    team: core.getInput("team"),
  };

  core.info(ansi_colors.green + "STEP: Getting Heroku Config - Success")
  return heroku;
}