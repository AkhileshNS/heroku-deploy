import { IHeroku } from '../types';

// IF justlogin = true, then return false and stop the pipeline
// else return true and continue the pipeline
export const justLogin = (heroku: IHeroku): boolean => !heroku.justlogin