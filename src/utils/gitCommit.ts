import { exec, execFile } from 'node:child_process';

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

export const gitCommitAsync = (
  message: string,
  edit: undefined | boolean = false
): Promise<string> => {
  const safeMessage = message.replace(/"/g, '\\"');
  //const cmd = `git commit -m "${safeMessage}"`;
  const cmd = `git commit ${edit ? '-e ' : ''}-m "${safeMessage}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, _, stderr) => {
      if (error) {
        // imprimes stderr para depurar si lo necesitas
        console.error('git stderr:', stderr);
        return reject(new Error(`❌ Error ejecutando git commit: ${error.message}`));
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve(`✔ Commit created successfully.`);
    });
  });
};
