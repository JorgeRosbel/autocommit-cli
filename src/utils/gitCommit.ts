import { execFile } from 'node:child_process';

export const gitCommit = (message: string) => {
  execFile('git', ['commit', '-m', message], (error, _, stderr) => {
    if (error) {
      console.error('❌ Error ejecutando git commit:', error.message);
      process.exit(1);
    }
    if (stderr) {
      console.warn(stderr);
    }
  });
};

export const gitCommitAsync = (message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    execFile('git', ['commit', '-m', message], (error, _, stderr) => {
      if (error) {
        return reject(new Error(`❌ Error ejecutando git commit: ${error.message}`));
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve(`✔  Commit "${message}" created successfully.`);
    });
  });
};
