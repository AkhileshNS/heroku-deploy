// IMPORTS
import { promisify } from 'util';
import {parse, stringify} from 'yaml';
import {join} from 'path';
import {readFile, writeFile} from 'fs';

// PROMISE-CONVERTED FUNCTIONS
const read = promisify(readFile);
const write = promisify(writeFile);

// TYPES
interface IPreActionsWithoutRequired {
  [key: string]: {
    description: string;
    default?: string | boolean | number;
  }
}

interface IPreActions {
  [key: string]: {
    description: string;
    required: boolean;
    default?: string | boolean | number;
  }
}

interface IOutputs {
  [key: string]: {
    description: string;
  }
}

interface IEnv {
  [key: string]: string;
}

interface IActions {
  name: string;
  description: string;
  branding: {
    icon: string;
    color: string;
  };
  inputs: IPreActions;
  outputs: IOutputs;
  runs: {
    using: "docker",
    image: string;
    env: IEnv
  }
}

// HELPER FUNCTIONS
const addRequired = (preActions: IPreActionsWithoutRequired, allowedRequired: string[]): IPreActions => 
  Object.keys(preActions).reduce((running, current) => ({
    ...running,
    [current]: {
      ...preActions[current],
      required: allowedRequired.includes(current)
    }
  }), {} as IPreActions);

const convertPreActionsToActions = (preActions: IPreActions): IActions => ({
  name: "Deploy to Heroku",
  description: "Deploy an app to Heroku",
  branding: {
    icon: "upload-cloud",
    color: "purple",
  },
  inputs: preActions,
  outputs: {
    status: {
      description: "The Success/Failure of the action"
    }
  },
  runs: {
    using: "docker",
    image: "Dockerfile",
    env: Object.keys(preActions).reduce((running, current) => ({
      ...running, 
      ["ga_" + current]: "${{ inputs." + current + " }}"
    }), {})
  }
}); 

// RUN
(async () => {
  try {
    // CONSTANTS
    const readPath = join(process.cwd(), "pre-action.yml");
    const writePath = join(process.cwd(), "action.yml");
    const allowedRequired = ["heroku_api_key", "heroku_email", "heroku_app_name"];

    // PIPELINE
    /* STEP */ const preActionsRaw = await read(readPath, "utf-8");
    /* STEP */ const preActionsWithoutRequired: IPreActionsWithoutRequired = parse(preActionsRaw);
    /* STEP */ const preActions = addRequired(preActionsWithoutRequired, allowedRequired);
    /* STEP */ const actions: IActions = convertPreActionsToActions(preActions);
    /* STEP */ const actionsRaw = stringify(actions);
    /* STEP */ await write(writePath, actionsRaw, "utf-8");
  } catch (err) {
    console.log(err);
  }
})()