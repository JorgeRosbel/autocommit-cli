import commitTemplates from '../templates/templates';
import boxen from 'boxen';
import chalk from 'chalk';
import inquirer from 'inquirer';
import type { TLang, TCommitTemplate, TSize } from '../types';
import { gitCommitAsync } from '@/utils/gitCommit';
import { gitStaging } from '../utils/gitStaging';
import { getGitzenConfig } from '../utils/getGitzenConfig';
import { PlaninResponse } from '../utils/PlainResponse';

const execCommit = async (message: string, edit: undefined | boolean) => {
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git_commit',
      message: 'Do you want to commit with the previous message?',
      default: true,
    },
  ]);

  if (response.git_commit) {
    const r = await gitCommitAsync(message, edit);
    console.log(chalk.green(r));
  }
};

const pompt_config = (language: TLang, template: TCommitTemplate, size: TSize, diff: string) => {
  const requiresBody = ['angular', 'conventional'].includes(template);

  const prompt = `
  You are an expert in writing well-formatted git commit messages.

  Write a commit message based on this diff:
  ${diff}

  - Style: ${template}
  - Language: ${language}
  - Length: ${size}
  - Format: ${commitTemplates[template].join(',')}

  ${
    requiresBody
      ? 'Include a body only if it adds valuable context. Do not include a footer unless required.'
      : 'Only write the commit title. Do NOT include a body or footer.'
  }
    
  Return only the formatted commit message.
  `;

  const system_prompt = `You are a expert developer and you are going to write a commit message for a git commit using the best practices.
  Do NOT use backticks, triple backticks, or any other quotation marks`;

  return { prompt, system_prompt };
};

export const commit = async (autoAccept: boolean | undefined, edit: boolean | undefined) => {
  try {
    const { template, model, size, language, provider } = getGitzenConfig();
    const diff = await gitStaging();
    const { prompt, system_prompt } = pompt_config(language, template, size, diff);

    if (diff.length === 0) {
      console.log(chalk.red('Nothing to commit'));
      process.exit(0);
    }

    const response = await PlaninResponse({ provider, model, system_prompt, prompt });

    console.log(boxen(chalk.cyan(response), { padding: 1 }));

    if (response && !autoAccept) {
      await execCommit(response, edit);
    }

    if (response && autoAccept) {
      const r = await gitCommitAsync(response, edit);
      console.log(chalk.green(r));
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
