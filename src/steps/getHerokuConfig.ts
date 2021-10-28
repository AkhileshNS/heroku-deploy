import { IHeroku } from '../types';

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
  try {
    console.log("⌛ STEP: Getting Heroku Config")

    const heroku = {
      api_key: process.env["ga_heroku_api_key"],
      email: process.env["ga_heroku_email"],
      app_name: process.env["ga_heroku_app_name"],
      buildpack: process.env["ga_buildpack"],
      branch: process.env["ga_branch"],
      dontuseforce: process.env["ga_dontuseforce"] === "false" ? false : true,
      dontautocreate: process.env["ga_dontautocreate"] === "false" ? false : true,
      usedocker: process.env["ga_usedocker"] === "false" ? false : true,
      dockerHerokuProcessType: process.env["ga_docker_heroku_process_type"],
      dockerBuildArgs: formatDockerBuildArgs(process.env["ga_docker_build_args"]),
      appdir: formatAppdir(process.env["ga_appdir"]),
      healthcheck: process.env["ga_healthcheck"],
      checkstring: process.env["ga_checkstring"],
      delay: parseInt(process.env["ga_delay"]),
      procfile: process.env["ga_procfile"],
      rollbackonhealthcheckfailed:
        process.env["ga_rollbackonhealthcheckfailed"] === "false" ? false : true,
      env_file: process.env["ga_env_file"],
      justlogin: process.env["ga_justlogin"] === "false" ? false : true,
      region: process.env["ga_region"],
      stack: process.env["ga_stack"],
      team: process.env["ga_team"],
    };

    console.log("✔️ STEP: Getting Heroku Config - Success")
    return heroku;
  } catch (err) {
    console.log("❌ STEP: Getting Heroku Config - Failure")
    throw err;
  }
}