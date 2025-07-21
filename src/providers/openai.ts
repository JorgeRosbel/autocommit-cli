import chalk from 'chalk';
import OpenAI from 'openai';
import ora from 'ora';

export const generateOpen = async (
  model: string,
  system_prompt: string,
  prompt: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.GITZEN_API_KEY,
  });

  const spinner = ora(chalk.yellow('Generating commit...')).start();

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
    spinner.fail();
    console.log(error);
    process.exit(1);
  }
};
