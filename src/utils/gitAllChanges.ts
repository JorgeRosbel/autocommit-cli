import chalk from 'chalk';
import { execFile } from 'node:child_process';

export const gitAllChanges = (): Promise<string> => {
  // todos los cambios
  const gitDiffCommand = "git diff HEAD --unified=0 | grep -E '^[+-][^+-]' || true";

  return new Promise((resolve, reject) => {
    execFile('sh', ['-c', gitDiffCommand], (error, stdout, stderr) => {
      if (error) {
        // If there are no staged changes, git diff returns exit code 1
        if (error.code === 1 && !stdout && !stderr) {
          return reject(new Error('No staged changes to commit'));
        }
        return reject(new Error(`Error executing git diff: ${error.message}`));
      }

      if (stderr) {
        console.log(chalk.yellow('Warning from git diff:', stderr));
        process.exit(1);
      }

      if (!stdout.trim()) {
        console.log(chalk.red('No changes detected in staged files'));
        process.exit(1);
        //return reject();
      }

      resolve(stdout);
    });
  });
};
