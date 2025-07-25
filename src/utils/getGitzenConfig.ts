import fs from 'fs';
import { join } from 'path';
import { type IConigGitzen } from '../types';

export const getGitzenConfig = () => {
  try {
    const config_json = join(process.cwd(), 'gitzen.config.json');
    const { template, model, size, language, provider } = JSON.parse(
      fs.readFileSync(config_json, 'utf-8')
    ) as IConigGitzen;

    return { template, model, size, language, provider };
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
