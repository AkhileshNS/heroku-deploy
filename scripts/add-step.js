const fs = require("fs");
const path = require("path");

const genStepFile = (name, desc) => `
import core from '@actions/core';
import { IHeroku } from '../types';
import { ansi_colors } from '../util';

export const ${name} = (heroku: IHeroku): boolean => {
  core.debug(ansi_colors.cyan + "STEP: ${desc}");
  
  core.info(ansi_colors.green + "STEP: ${desc} - Success")
  return true;
}
`;

(async () => {
  try {
    const stepName = process.argv[2];
    const stepDesc = process.argv[3] || stepName;
    const stepPath = path.join(process.cwd(), `src/steps/${stepName}.ts`);
    const indexPath = path.join(process.cwd(), "src/steps/index.ts");

    fs.writeFileSync(stepPath, genStepFile(stepName, stepDesc));
    fs.appendFileSync(
      indexPath,
      `\nexport { ${stepName} } from './${stepName}';`
    );
  } catch (err) {
    console.log(err);
  }
})();
