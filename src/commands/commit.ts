import { execFile } from 'node:child_process';
import { join } from 'path';
import fs from 'fs';
import commitTemplates from '../templates/templates';
import boxen from 'boxen';
import chalk from 'chalk';
import { generateGo } from '../providers/google';
import { generateOpen } from '../providers/openai';
import inquirer from 'inquirer';
import type { TLang, TCommitTemplate, TSize, IConigGitzen } from '../types';
// npm run build && npm link

const gitCommit = async (message: string) => {
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git_commit',
      message: 'Do you want to commit with the previous message?',
      default: true,
    },
  ]);

  if (response.git_commit) {
    gitCommitScript(message);
  }
};

const gitCommitScript = (message: string) => {
  execFile('git', ['commit', '-m', message], (error, _, stderr) => {
    if (error) {
      console.error('❌ Error ejecutando git commit:', error.message);
      process.exit(1);
    }
    if (stderr) {
      console.warn(stderr);
    }
  });
};

const gitDiffScript = (): Promise<string> => {
  const gitDiffCommand = "git diff --cached --unified=0 | grep -E '^[+-][^+-]' || true";

  return new Promise((resolve, reject) => {
    execFile('sh', ['-c', gitDiffCommand], (error, stdout, stderr) => {
      if (error) {
        // If there are no staged changes, git diff returns exit code 1
        if (error.code === 1 && !stdout && !stderr) {
          return reject(new Error('No staged changes to commit'));
        }
        return reject(new Error(`Error executing git diff: ${error.message}`));
      }

      if (stderr) {
        console.warn('Warning from git diff:', stderr);
      }

      if (!stdout.trim()) {
        return reject(new Error('No changes detected in staged files'));
      }

      resolve(stdout);
    });
  });
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
  - Format: ${commitTemplates[template].join(', ')}

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

export const commit = async () => {
  try {
    const config_json = join(process.cwd(), 'gitzen.config.json');
    const { template, model, size, language, provider } = JSON.parse(
      fs.readFileSync(config_json, 'utf-8')
    ) as IConigGitzen;
    const diff = await gitDiffScript();
    const { prompt, system_prompt } = pompt_config(language, template, size, diff);

    if (diff.length === 0) {
      console.log(chalk.red('Nothing to commit'));
      process.exit(0);
    }

    let response: string | null = null;

    if (provider === 'google') {
      response = await generateGo(model, system_prompt, prompt);
    }

    if (provider === 'openai') {
      response = await generateOpen(model, system_prompt, prompt);
    }

    console.log(boxen(chalk.cyan(response), { padding: 1 }));

    if (response) {
      await gitCommit(response);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
