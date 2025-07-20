import { execFile } from 'node:child_process';
import { join } from 'path';
import fs from 'fs';
import commitTemplates from '../templates/templates';
import boxen from 'boxen';
import chalk from 'chalk';
import { generateCommitGoo } from '../providers/google';
import { generateCommitOpen } from '../providers/openai';
import inquirer from 'inquirer';

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

const pompt_config = (language: string, template: string, size: string, diff: string) => {
  const prompt = `
    Write a commit message for a git commit based on the following diff:
    ${diff}
    The commit message should be ${size}.
    The commit message should be in ${language}.
    Infer the commit type based on the changes made and the commit message should be in ${commitTemplates[template].join(',')} format.
    Do not use quotes
    `;

  const system_prompt = `You are a expert developer and you are going to write a commit message for a git commit using the best practices`;

  return { prompt, system_prompt };
};

export const commit = async () => {
  try {
    const config_json = join(process.cwd(), 'gitbolt.config.json');
    const { template, model, size, language, provider } = JSON.parse(
      fs.readFileSync(config_json, 'utf-8')
    );
    const diff = await gitDiffScript();
    const { prompt, system_prompt } = pompt_config(language, template, size, diff);

    if (diff.length === 0) {
      console.log(chalk.red('Nothing to commit'));
      process.exit(0);
    }

    let response: string | null = null;

    if (provider === 'google') {
      response = await generateCommitGoo(model, system_prompt, prompt);
    }

    if (provider === 'openai') {
      response = await generateCommitOpen(model, system_prompt, prompt);
    }

    console.log(boxen(chalk.green(response), { padding: 1 }));

    if (response) {
      await gitCommit(response);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
