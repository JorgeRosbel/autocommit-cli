import OpenAI from 'openai';
import ora from 'ora';
import chalk from 'chalk';

export const generateGo = async (
  model: string,
  system_prompt: string,
  prompt: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.GITZEN_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  const messages = [
    chalk.blue(`Generating content using model: ${chalk.green(model)}...`),
    chalk.blue(`Processing request with model: ${chalk.green(model)}...`),
    chalk.blue(`Working on it using model ${chalk.green(model)}...`),
    chalk.blue(`Initializing generation with model: ${chalk.green(model)}...`),
  ];

  const spinner = ora(chalk.green()).start(messages[((messages.length - 1) * Math.random()) | 0]);

  try {
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

    spinner.succeed(chalk.green('Success!'));
    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    spinner.fail();
    process.exit(1);
  }
};
