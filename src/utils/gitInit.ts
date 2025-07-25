import { exec } from 'node:child_process';

export const gitInit = (): Promise<string> => {
  const cmd = 'git init';

  return new Promise((resolve, reject) => {
    exec(cmd, (error, _, stderr) => {
      if (error) {
        // imprimes stderr para depurar si lo necesitas
        console.error('git stderr:', stderr);
        return reject(new Error(`❌ Error git commit: ${error.message}`));
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve('✔ Repository initialized successfully');
    });
  });
};
