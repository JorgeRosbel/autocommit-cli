import OpenAI from 'openai';

export const generateCommitOpen = async (
  model: string,
  system_prompt: string,
  prompt: string
): Promise<string | null> => {
  const openai = new OpenAI({
    apiKey: process.env.AUTOCOMMIT_API_KEY,
  });

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

    return response.choices[0].message.content;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
