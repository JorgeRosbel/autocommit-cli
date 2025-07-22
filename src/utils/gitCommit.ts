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

// export const gitCommitAsync = (message: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     execFile('git', ['commit', '-m', message], (error, _, stderr) => {
//       if (error) {
//         return reject(new Error(`❌ Error ejecutando git commit: ${error.message}`));
//       }
//       if (stderr) {
//         console.warn(stderr);
//       }
//       resolve(`✔  Commit "${message}" created successfully.`);
//     });
//   });
// };

export const gitCommitAsync = (message: string): Promise<string> => {
  // escapamos posibles comillas dobles en el mensaje
  const safeMessage = message.replace(/"/g, '\\"');
  const cmd = `git commit -m "${safeMessage}"`;

  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        // imprimes stderr para depurar si lo necesitas
        console.error('git stderr:', stderr);
        return reject(new Error(`❌ Error ejecutando git commit: ${error.message}`));
      }
      if (stderr) {
        console.warn(stderr);
      }
      resolve(stdout.trim() || `✔  Commit "${message}" created successfully.`);
    });
  });
};
