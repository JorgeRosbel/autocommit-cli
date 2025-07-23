import fs from 'fs';
import path from 'path';
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import boxen from 'boxen';

export const packageJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
);

// OPCIÓN 1: Usando las plantillas de update-notifier (RECOMENDADO)
const customMessage = `
🚀 A new version is available!
📦 Current: {currentVersion}
✨ Latest:  {latestVersion}
👉 Update now with: npm install -g gitzen
`;

export const notify = () => {
  const notifier = updateNotifier({ pkg: packageJson });

  notifier.notify({
    message: boxen(chalk.yellow(customMessage), {
      padding: 1,
      margin: 1,
      borderColor: 'yellow',
    }),
  });
};
