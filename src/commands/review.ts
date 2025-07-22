import { TLang } from '@/types';
import { getGitzenConfig } from '@/utils/getGitzenConfig';
import { gitStaging } from '@/utils/gitStaging';
import { PlaninResponse } from '@/utils/PlainResponse';
import boxen from 'boxen';
import chalk from 'chalk';

const prompt_config = (lang: string | undefined, diff: string, language: TLang) => {
  const system_prompt = `
    You are a Senior Software Developer specialized in code‑readiness reviews.
    Respond using PLAIN TEXT only.
    Be concise and compact — avoid overly long explanations.
    Focus on clear insights, actionable suggestions, and objective evaluation.
    `;

  const prompt = `
    Perform a code‑readiness review in the language corresponding to the code ${!lang ? language : lang}. 
    Your goal is to assess whether these changes are ready to commit. Your review should include:

    1. Analysis of code quality (correctness, performance, security, style, maintainability).  
    2. Identification of any **potential issues** or anti‑patterns.  
    3. Concrete **suggestions for improvement** (refactorings, style fixes, etc.) and **tests** you would add.  
    4. Note any **breaking changes** or API impacts.  
    5. At the end, assign a **readiness score** from **0 to 100**, with a one‑sentence justification for the score.

    Git diff to review:
    \`\`\`
    ${diff}
    \`\`\`
    `;

  return { prompt, system_prompt };
};

export const review = async (lang: string | undefined) => {
  try {
    const { model, language, provider } = getGitzenConfig();
    const diff = await gitStaging();
    const { prompt, system_prompt } = prompt_config(lang, diff, language);

    const response = await PlaninResponse({ provider, model, system_prompt, prompt });

    console.log(boxen(chalk.green(response), { padding: 1 }));
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
