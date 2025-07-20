import OpenAI from 'openai';
import ora from 'ora';

export const generateCommitGoo = async (
  model: string,
  system_prompt: string,
  prompt: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.AUTOCOMMIT_API_KEY,
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  const spinner = ora('Generating commit...').start();

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

    spinner.succeed();
    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    spinner.fail();
    process.exit(1);
  }
};
