import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';
import { TModel, TProviders } from '../types';
import ora from 'ora';
import chalk from 'chalk';

interface IStructuredResponse {
  provider: TProviders;
  model: TModel;
  system_prompt: string;
  prompt: string;
}

const batchSchema = z.object({
  analysis: z.object({
    totalFiles: z.number(),
    groupsFound: z.number(),
    confidence: z.number().min(0).max(1).describe('AI confidence in grouping (0-1)'),
  }),

  groups: z.array(
    z.object({
      id: z.string().describe('Unique identifier for the group'),
      category: z
        .enum([
          'ui',
          'core',
          'docs',
          'tests',
          'config',
          'styles',
          'api',
          'database',
          'utils',
          'build',
          'other',
        ])
        .describe('Type of changes in this group'),
      icon: z.string().describe('Emoji icon representing the category'),
      name: z.string().describe('Human readable name for the group'),
      description: z.string().describe('Brief description of changes'),
      files: z.array(
        z.object({
          path: z.string().describe('Relative file path'),
          changeType: z.enum(['modified', 'added', 'deleted', 'renamed']),
          linesChanged: z.number().describe('Approximate lines changed'),
        })
      ),
      priority: z.number().min(1).max(3).describe('Commit order priority (1=high, 3=low)'),
      dependencies: z.array(z.string()).describe('IDs of groups this depends on'),
    })
  ),

  suggestedCommits: z.array(
    z.object({
      groupId: z.string().describe('References group.id'),
      message: z.string().describe('Generated commit message'),
      breaking: z.boolean().default(false).describe('Is this a breaking change?'),
      files: z.array(z.string()).describe('List of file paths for this commit'),
    })
  ),
});

export type GitzenBatchResponse = z.infer<typeof batchSchema>;

export const StructuredResponse = async ({
  provider,
  model,
  system_prompt,
  prompt,
}: IStructuredResponse) => {
  const openai = new OpenAI({
    apiKey: process.env.GITZEN_API_KEY,
    baseURL:
      provider === 'google'
        ? 'https://generativelanguage.googleapis.com/v1beta/openai/'
        : undefined,
  });

  const spinner = ora(chalk.blue('Generating...')).start();

  try {
    const completion = await openai.chat.completions.parse({
      model: model,
      messages: [
        { role: 'system', content: system_prompt },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: zodResponseFormat(batchSchema, 'event'),
    });

    const result = completion.choices[0].message.parsed as GitzenBatchResponse;

    spinner.succeed(chalk.green('Success!'));
    return result;
  } catch (error) {
    spinner.fail();
    console.log(error);
    process.exit(1);
  }
};
