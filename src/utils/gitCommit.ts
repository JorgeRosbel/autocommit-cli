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
