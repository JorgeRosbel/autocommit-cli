import { execFile } from 'node:child_process';

export const gitAdd = async (files: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execFile('git', ['add', `${files}`], (error, stdout) => {
      if (error) {
        if (error.code === 128) {
          return reject(new Error('Not a git repository (or any of the parent directories)'));
        }
        return reject(new Error(`Error executing git status: ${error.message}`));
      }

      if (!stdout.trim()) {
        return reject(new Error('No changes detected in working directory'));
      }

      resolve(stdout);
    });
  });
};
