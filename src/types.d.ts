export type TCommitTemplate = 'commitlint' | 'conventional' | 'angular';

export type TProviders = 'google' | 'openai' | 'anthropics';

export type TSize =
  | '16–35 characters'
  | '36–50 characters'
  | '51–80 characters'
  | '81–120 characters';

export type TModel =
  | 'gpt-4.1'
  | 'gpt-4.1-nano-2025-04-14'
  | 'gpt-4o-2024-08-06'
  | 'gpt-4o-mini'
  | 'gpt-4'
  | 'gpt-3.5-turbo'
  | 'gemini-2.5-flash'
  | 'gemini-2.0-flash'
  | (string & {});

export type TLang = 'en' | 'es' | 'pt' | 'fr' | 'de' | 'it' | 'zh' | 'ja' | 'ko';

export interface IConigGitzen {
  language: TLang;
  template: TCommitTemplate;
  model: TModel;
  size: TSize;
  provider: TProviders;
}
