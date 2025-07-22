import { gitWorkingDiff } from '../utils/gitWorking';
import { getGitzenConfig } from '../utils/getGitzenConfig';
import { gitStatus } from '../utils/gitStatus';
import { gitCommit } from '../utils/gitCommit';

import { StructuredResponse } from '../utils/StructuredResponse';
import { TCommitTemplate, TLang, TSize } from '../types';
import commitTemplates from '../templates/templates';
import chalk from 'chalk';
import boxen from 'boxen';
import { gitAdd } from '../utils/gitAdd';

import { type GitzenBatchResponse } from '../utils/StructuredResponse';
import inquirer from 'inquirer';

type TPayload = { commit: string; files: string }[];

const prompt_config = (
  language: TLang,
  template: TCommitTemplate,
  size: TSize,
  diff: string,
  status: string
) => {
  const requiresBody = ['angular', 'conventional'].includes(template);

  const prompt = `
  You are an expert in writing well-formatted git commit messages.

  git status: ${status}

  GROUPING CRITERIA:
    - Files that serve the same purpose (UI, logic, docs, tests, config)
    - Files that are functionally related or dependent
    - Changes that represent a single feature/fix/improvement
    - Separate breaking changes from non-breaking ones

    ANALYSIS RULES:
    1. Group files by logical purpose, not just by directory
    2. Consider file types: .js/.tsx (logic), .css/.scss (styles), .md (docs), .json (config)
    3. Look for patterns in diffs: new features, bug fixes, refactoring, documentation
    4. Separate concerns: don't mix UI changes with business logic
    5. Prioritize commits: dependencies first, then features, then docs

  Write a commit message based on this diff for each identified group:
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

const buildBatchAnalysisOutput = (response: GitzenBatchResponse): string => {
  let output = '';

  output += `Found ${response.analysis.groupsFound} logical groups:\n\n`;

  response.groups
    .sort((a, b) => a.priority - b.priority)
    .forEach(group => {
      output += `${group.icon} ${group.name} (${group.files.length} files):\n`;
      group.files.forEach(file => {
        output += `  - ${file.path}\n`;
      });
      output += '\n';
    });

  output += 'Suggested commits:\n';
  response.suggestedCommits.forEach((commit, index) => {
    const breaking = commit.breaking ? ' ⚠️ BREAKING' : '';
    output += `${index + 1}. "${commit.message}"${breaking}\n`;
  });

  return output;
};

// Versión más avanzada con información adicional opcional
const buildBatchAnalysisOutputDetailed = (response: GitzenBatchResponse): string => {
  let output = '';

  // Header con análisis
  output += `🧠 Analyzing staged changes...\n\n`;
  output += `Found ${response.analysis.groupsFound} logical groups:\n`;

  if (response.analysis.confidence) {
    const confidencePercent = Math.round(response.analysis.confidence * 100);
    output += `Confidence: ${confidencePercent}%\n`;
  }

  output += '\n';

  // Grupos ordenados por prioridad
  response.groups
    .sort((a, b) => a.priority - b.priority)
    .forEach(group => {
      output += `${group.icon} ${group.name} (${group.files.length} files):\n`;

      if (group.description) {
        output += `   ${group.description}\n`;
      }

      group.files.forEach(file => {
        const linesInfo = file.linesChanged ? ` (+${file.linesChanged} lines)` : '';
        const statusInfo = file.changeType !== 'modified' ? ` [${file.changeType}]` : '';
        output += `  - ${file.path}${statusInfo}${linesInfo}\n`;
      });

      output += '\n';
    });

  // Commits sugeridos
  output += 'Suggested commits:\n';
  response.suggestedCommits.forEach((commit, index) => {
    const breaking = commit.breaking ? ' ⚠️ BREAKING' : '';
    output += `${index + 1}. "${commit.message}"${breaking}\n`;
  });

  return output;
};

// Versión minimalista para casos simples
const buildBatchAnalysisOutputSimple = (response: GitzenBatchResponse): string => {
  let output = '';

  response.groups
    .sort((a, b) => a.priority - b.priority)
    .forEach((group, index) => {
      if (index > 0) output += '\n';
      output += `${group.icon} ${group.name}:\n`;
      group.files.forEach(file => {
        output += `  ${file.path}\n`;
      });
    });

  output += '\nCommits:\n';
  response.suggestedCommits.forEach((commit, index) => {
    output += `${index + 1}. ${commit.message}\n`;
  });

  return output;
};

export {
  buildBatchAnalysisOutput,
  buildBatchAnalysisOutputDetailed,
  buildBatchAnalysisOutputSimple,
};

const giBatchConfirm = async (text: string) => {
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: text,
      default: true,
    },
  ]);

  return response.confirm;
};

async function runSequential(payload: TPayload) {
  for (const item of payload) {
    const { commit, files } = item;

    await gitAdd(files);
    gitCommit(commit);
  }
}

export const batchCommit = async () => {
  try {
    const diff = await gitWorkingDiff();
    const status = await gitStatus();
    const { provider, model, language, template, size } = getGitzenConfig();
    const { system_prompt, prompt } = prompt_config(language, template, size, diff, status);

    const response = await StructuredResponse({ provider, model, system_prompt, prompt });
    const res = buildBatchAnalysisOutputDetailed(response);

    console.log(boxen(chalk.yellow(res), { padding: 1 }));

    let question = `Do you want to perform the following actions?:\n\n`;
    const payload: TPayload = [];

    response.groups.forEach((group, index) => {
      const paths = group.files.map(v => v.path).join(' ');
      const commit_msg = response.suggestedCommits[index].message;
      const info = `git add ${paths}\ngit commit -m "${commit_msg}"\n\n`;
      payload.push({ commit: commit_msg, files: paths });

      question += info;
    });

    console.log(boxen(chalk.cyan(question), { padding: 1 }));

    const confirm = await giBatchConfirm('Proceed?');

    if (confirm) {
      runSequential(payload);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
