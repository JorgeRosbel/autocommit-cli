import { exec } from 'child_process';
import { promisify } from 'util';
import updateNotifier from 'update-notifier';
import chalk from 'chalk';
import boxen from 'boxen';
import { packageJson } from '@/utils/notify';

const execAsync = promisify(exec);

export const updateCommand = async () => {
  try {
    console.log(chalk.blue('🔍 Checking for updates...'));

    const notifier = updateNotifier({ pkg: packageJson });
    await notifier.fetchInfo();

    if (!notifier.update) {
      console.log(chalk.green('✅ You already have the latest version!'));
      console.log(chalk.green(`Current version: ${packageJson.version}`));
      return;
    }

    const { current, latest } = notifier.update;

    console.log(
      boxen(
        chalk.yellow(`
🚀 Update available!
📦 Current: ${current}
✨ Latest:  ${latest}
      `),
        { padding: 1, margin: 1, borderColor: 'yellow' }
      )
    );

    console.log(chalk.blue('📥 Installing update...'));

    const { stderr } = await execAsync(`npm install -g ${packageJson.name}@latest`);

    if (stderr && !stderr.includes('WARN')) {
      throw new Error(stderr);
    }

    console.log(chalk.green('✅ Successfully updated!'));
    console.log(chalk.gray('Run your command again to use the latest version.'));
  } catch (error) {
    console.error(chalk.red('❌ Update failed:'), error);
    console.log(chalk.yellow('💡 Try running manually:'));
    console.log(chalk.cyan(`   npm install -g ${packageJson.name}@latest`));
    process.exit(1);
  }
};
