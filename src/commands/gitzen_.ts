import boxen from 'boxen';
import chalk from 'chalk';
import figlet from 'figlet';
import { cristal } from 'gradient-string';

const asciiText = figlet.textSync('Gitzen', {
  font: 'Banner3',
  horizontalLayout: 'default',
});
const gradientText = cristal(asciiText);

const HelpText = `\n${gradientText}\n`;

const customHelp = boxen(
  `
🧠 ${chalk.bold('Gitzen')} — AI-powered CLI for smart git commits | ${chalk.green('v0.1.5')}

${chalk.bold('Commands:')}

  ${chalk.green('start')}         🚀 Initialize Gitzen setup and config
  ${chalk.green('commit')}        💾 Generate commit message with AI from staged changes
  ${chalk.green('summarize')}     🧠 Summarize changes in staging/working dir
  ${chalk.green('batch')}         📂 Group unstaged changes and commit in logical order
  ${chalk.green('review')}        🔍 Gives you a review of the code in the staging area
 
🔧 Run ${chalk.cyanBright('gitzen start')} to initialize the configuration
`,
  {
    padding: 1,
    borderColor: 'cyan',
    borderStyle: 'round',
    align: 'left',
    margin: 1,
  }
);

export { HelpText, customHelp };
