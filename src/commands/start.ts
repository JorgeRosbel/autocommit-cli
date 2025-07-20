import figlet from 'figlet';
import chalk from 'chalk';
import inquirer from 'inquirer';
import fs from 'fs';
import { join } from 'path';
import boxen from 'boxen';
import { execFile } from 'node:child_process';

// npm run build && npm link && autocommit start

const gitInit = async () => {
  const response = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'git_init',
      message: 'Do you want to initialize git?',
      default: true,
    },
  ]);

  if (response.git_init) {
    gitInitScript();
  }
};

const gitInitScript = () => {
  const script = join(process.cwd(), '/src/utils/git_init.sh');

  execFile('sh', [script], (error, _, stderr) => {
    if (error) {
      console.error('❌ Error executing script:', error.message);
      process.exit(1);
    }
    if (stderr) {
      console.error('⚠️ Script stderr:', stderr);
      process.exit(1);
    }
  });
};

const gitCommitTemplate = async () => {
  const templates = [
    { name: chalk.green('commitlint'), value: 'commitlint' },
    { name: chalk.blue('conventional'), value: 'conventional' },
  ];

  const { selectedTemplate } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedTemplate',
      message: 'Select a commit template to use:',
      choices: templates,
    },
  ]);

  return selectedTemplate;
};

const initModel = async () => {
  const models = [
    {
      name: `${chalk.green('gpt-4.1')} - ${chalk.dim('Latest GPT-4 model')}`,
      value: 'gpt-4.1',
    },
    {
      name: `${chalk.blue('gpt-4o-2024-08-06')} ${chalk.yellow('🧠')} - High precision with zodResponseFormat`,
      value: 'gpt-4o-2024-08-06',
    },
    {
      name: `${chalk.cyan('gpt-4o-mini')} ${chalk.yellow('⚡')} - Faster and more affordable`,
      value: 'gpt-4o-mini',
    },
    {
      name: `${chalk.magenta('gpt-4')} - More expensive but compatible`,
      value: 'gpt-4',
    },
    {
      name: `${chalk.yellow('gpt-3.5-turbo')} - Good for simple tasks`,
      value: 'gpt-3.5-turbo',
    },
    {
      name: `${chalk.blueBright('gemini-2.5-flash')} - Google's Gemini model`,
      value: 'gemini-2.5-flash',
    },
    {
      name: `${chalk.blue('gemini-2.0-flash')} - Previous version of Gemini`,
      value: 'gemini-2.0-flash',
    },
  ];

  const { selectedModel } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedModel',
      message: 'Select an AI model to use:',
      choices: models,
      pageSize: 10,
    },
  ]);

  return selectedModel;
};

const commitSize = async () => {
  const sizes = [
    { name: chalk.green('small'), value: '16–35 characters' },
    { name: chalk.blue('medium'), value: '36–50 characters' },
    { name: chalk.cyan('large'), value: '51–80 characters' },
    { name: chalk.magenta('extra-large'), value: '81–120 characters' },
  ];

  const { selectedSize } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedSize',
      message: 'Select a commit size to use:',
      choices: sizes,
      pageSize: 10,
    },
  ]);

  return selectedSize;
};

const initApiKey = async () => {
  const { apiKey } = await inquirer.prompt([
    {
      type: 'input',
      name: 'apiKey',
      message: 'Enter your API key:',
    },
  ]);

  const out = `
  export API_KEY="${apiKey}"

  if grep -q '^export AUTOCOMMIT_API_KEY=' ~/.bashrc; then
    # Reemplaza la línea existente
    sed -i "s|^export AUTOCOMMIT_API_KEY=.*|export AUTOCOMMIT_API_KEY=\"$API_KEY\"|" ~/.bashrc
  else
    # Añade la línea al final
    echo "export AUTOCOMMIT_API_KEY=\"$API_KEY\"" >> ~/.bashrc
  fi

  source ~/.bashrc
  echo "✅ AUTOCOMMIT_API_KEY set to \"$API_KEY\""

  `;

  console.log(
    boxen(
      chalk.blue(
        'Copy and paste this script into your terminal to add AUTOCOMMIT_API_KEY to your environment variables:'
      ),
      { padding: 1 }
    )
  );
  console.log(
    chalk.dim(
      'This will add your API key to your ~/.bashrc file, so it will be available in your terminal sessions.'
    )
  );
  console.log(chalk.cyanBright(out));
};

const initLang = async () => {
  const languages = [
    { name: chalk.blue('en'), value: 'en' },
    { name: chalk.green('es'), value: 'es' },
    { name: chalk.cyan('pt'), value: 'pt' },
    { name: chalk.magenta('fr'), value: 'fr' },
    { name: chalk.yellow('de'), value: 'de' },
    { name: chalk.grey('it'), value: 'it' },
    { name: chalk.red('zh'), value: 'zh' },
    { name: chalk.greenBright('ja'), value: 'ja' },
    { name: chalk.blueBright('ko'), value: 'ko' },
  ];

  const { selectedLanguage } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedLanguage',
      message: 'Select a language to use:',
      choices: languages,
    },
  ]);

  return selectedLanguage;
};

const initProviders = async () => {
  const providers = [
    { name: chalk.blue('openai'), value: 'openai' },
    { name: chalk.green('google'), value: 'google' },
  ];

  const { provider } = await inquirer.prompt([
    {
      type: 'list',
      name: 'provider',
      message: 'Select your provider:',
      choices: providers,
    },
  ]);

  return provider;
};

const saveConfig = (
  template: string,
  model: string,
  size: string,
  language: string,
  provider: string
) => {
  const config = {
    language: language,
    template: template,
    model: model,
    size: size,
    provider: provider,
  };

  const config_json = join(process.cwd(), 'autocommit.config.json');

  fs.writeFileSync(config_json, JSON.stringify(config, null, 2));

  console.log(chalk.green('Configuration saved successfully!'));
  console.log(boxen(JSON.stringify(config, null, 2), { padding: 1 }));
};

export const start = async () => {
  console.log(chalk.blue(figlet.textSync('AutoCommit CLI', { horizontalLayout: 'full' })));

  try {
    const config_json = join(process.cwd(), 'autocommit.config.json');

    if (fs.existsSync(config_json)) {
      console.log(
        boxen(
          chalk.green(
            "You don't need to use autocommit start, you already have a configuration file!"
          ),
          { padding: 1 }
        )
      );
      process.exit(0);
    }

    console.log(boxen(chalk.blue("Let's start the configuration process"), { padding: 1 }));

    await gitInit();
    const template = await gitCommitTemplate();
    const language = await initLang();
    const model = await initModel();
    const size = await commitSize();
    const provider = await initProviders();
    saveConfig(template, model, size, language, provider);
    await initApiKey();

    console.log(boxen(chalk.green('Configuration completed successfully!'), { padding: 1 }));

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
