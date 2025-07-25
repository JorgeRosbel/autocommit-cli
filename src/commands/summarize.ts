import boxen from 'boxen';
import chalk from 'chalk';
import { PlaninResponse } from '../utils/PlainResponse';
import { getGitzenConfig } from '../utils/getGitzenConfig';
import { TLang } from '../types';
import { gitWorkingDiff } from '@/utils/gitWorking';

const prompt_config = (lang: string | undefined, diff: string, language: TLang) => {
  const system_prompt = `You are a Senior Software Developer expert at analyzing git diffs and code changes`;
  const prompt = `Write in the language corresponding to the code "${!lang ? language : lang}" a compact plain‑text summary of the changes shown in this git diff.
      Instructions:
      - Explain WHAT changed and WHY it is relevant
      - Use plain text (line breaks allowed)
      - Be concise but informative

      Git diff to analyze:
      ${diff}`;

  return { prompt, system_prompt };
};

export const summarize = async (lang: string | undefined) => {
  try {
    const { model, language, provider } = getGitzenConfig();
    const diff = await gitWorkingDiff();
    const { prompt, system_prompt } = prompt_config(lang, diff, language);

    const response = await PlaninResponse({ provider, model, system_prompt, prompt });

    console.log(boxen(chalk.yellow(response), { padding: 1 }));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
