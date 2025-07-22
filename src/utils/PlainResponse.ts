import { generateGo } from '../providers/google';
import { generateOpen } from '../providers/openai';
import { TModel, type TProviders } from '../types';

interface IResponse {
  provider: TProviders;
  model: TModel;
  system_prompt: string;
  prompt: string;
}

export const PlaninResponse = async ({ provider, model, system_prompt, prompt }: IResponse) => {
  let response: string | null = null;

  if (provider === 'google') {
    response = await generateGo(model, system_prompt, prompt);
  }

  if (provider === 'openai') {
    response = await generateOpen(model, system_prompt, prompt);
  }

  return response;
};
