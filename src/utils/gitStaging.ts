import chalk from 'chalk';
import { execFile } from 'node:child_process';

export const gitStaging = (): Promise<string> => {
  const gitDiffCommand = "git diff --cached --unified=0 | grep -E '^[+-][^+-]' || true";

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
        console.warn('Warning from git diff:', stderr);
      }

      if (!stdout.trim()) {
        //return reject(new Error('No changes detected in staged files'));
        console.log(chalk.red('No changes detected in staged files'));
        process.exit(1);
      }

      resolve(stdout);
    });
  });
};
