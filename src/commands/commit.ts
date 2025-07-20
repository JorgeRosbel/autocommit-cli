import { execFile } from 'node:child_process';
import { join } from 'path';
import fs from 'fs';
import commitTemplates from '../templates/templates';
import OpenAI from 'openai';
import boxen from 'boxen';
import chalk from 'chalk';

// npm run build && npm link

const inferBaseURL = (model: string) => {
  if (model.startsWith('gpt')) {
    return 'https://api.openai.com/v1/chat/completions';
  }

  if (model.startsWith('claude')) {
    return 'https://api.openai.com/v1/chat/completions';
  }

  if (model.startsWith('gemini')) {
    return 'https://generativelanguage.googleapis.com/v1beta/openai/';
  }
};

const gitDiffScript = (): Promise<string> => {
  const script = join(process.cwd(), 'src/utils/git_diff.sh');

  return new Promise((resolve, reject) => {
    execFile('sh', [script], (error, stdout, stderr) => {
      if (error) {
        process.exit(1);
        //   return reject(new Error(`Error executing script: ${error.message}`));
      }
      if (stderr) {
        return reject(new Error(`Script stderr: ${stderr}`));
      }
      resolve(stdout);
    });
  });
};

const pompt_config = (language: string, template: string, size: string, diff: string) => {
  const prompt = `
    Write a commit message for a git commit based on the following diff:
    ${diff}
    The commit message should be ${size}.
    The commit message should be in ${language}.
    Infer the commit type based on the changes made and the commit message should be in ${commitTemplates[template].join(',')} format.
    `;

  const system_prompt = `You are a expert developer and you are going to write a commit message for a git commit using the best practices`;

  return { prompt, system_prompt };
};

export const commit = async () => {
  try {
    const config_json = join(process.cwd(), 'autocommit.config.json');
    const { template, model, size, language } = JSON.parse(fs.readFileSync(config_json, 'utf-8'));
    const diff = await gitDiffScript();
    const { prompt, system_prompt } = pompt_config(language, template, size, diff);

    if (diff.length === 0) {
      console.log(chalk.red('Nothing to commit'));
      process.exit(0);
    }

    const openai = new OpenAI({
      apiKey: process.env.AUTOCOMMIT_API_KEY,
      baseURL: inferBaseURL(model),
    });

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        { role: 'system', content: system_prompt },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log(boxen(chalk.green(response.choices[0].message.content), { padding: 1 }));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
