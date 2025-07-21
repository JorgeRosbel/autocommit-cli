import boxen from 'boxen';
import chalk from 'chalk';
import { join } from 'path';
import fs from 'fs';
import { IConigGitzen } from '../types';
import { generateGo } from '../providers/google';
import { generateOpen } from '../providers/openai';
import { execFile } from 'child_process';

const gitDiffScript = (): Promise<string> => {
  const gitDiffCommand = "git diff HEAD --unified=0 | grep -E '^[+-][^+-]' || true";

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

export const summarize = async (lang: string | undefined) => {
  try {
    const config_json = join(process.cwd(), 'gitzen.config.json');
    const { model, language, provider } = JSON.parse(
      fs.readFileSync(config_json, 'utf-8')
    ) as IConigGitzen;
    const diff = await gitDiffScript();
    const system_prompt = `You are a Senior Software Developer expert at analyzing git diffs and code changes`;
    const prompt = `Write in the language corresponding to the code "${!lang ? language : lang}" a compact plain‑text summary of the changes shown in this git diff.
        Instructions:
        - Explain WHAT changed and WHY it is relevant
        - Use plain text (line breaks allowed)
        - Be concise but informative

        Git diff to analyze:
        ${diff}`;

    let response: string | null = null;

    if (provider === 'google') {
      response = await generateGo(model, system_prompt, prompt);
    }

    if (provider === 'openai') {
      response = await generateOpen(model, system_prompt, prompt);
    }

    console.log(boxen(chalk.yellow(response), { padding: 1 }));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
