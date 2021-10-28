export interface IHeroku {
  api_key: string;
  email: string;
  app_name: string;
  buildpack: string;
  branch: string;
  dontuseforce: boolean;
  dontautocreate: boolean;
  usedocker: boolean;
  dockerHerokuProcessType: string;
  dockerBuildArgs: string;
  appdir: string;
  healthcheck: string;
  checkstring: string;
  delay: number;
  procfile: string;
  rollbackonhealthcheckfailed: boolean;
  env_file: string;
  justlogin: boolean;
  region: string;
  stack: string;
  team: string;
}