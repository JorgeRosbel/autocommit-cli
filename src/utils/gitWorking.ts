import { execFile } from 'node:child_process';

export const gitWorkingDiff = (): Promise<string> => {
  // comando para obtener solo los cambios no staged
  const gitDiffCommand = "git diff --unified=0 | grep -E '^[+-][^+-]' || true";

  return new Promise((resolve, reject) => {
    execFile('sh', ['-c', gitDiffCommand], (error, stdout, stderr) => {
      if (error) {
        // git diff devuelve código 1 si no hay cambios, sin stdout ni stderr
        if (error.code === 1 && !stdout && !stderr) {
          return reject(new Error('No unstaged changes to show'));
        }
        return reject(new Error(`Error executing git diff: ${error.message}`));
      }

      if (stderr) {
        console.warn('Warning from git diff:', stderr);
      }

      // si no hay salida, rechazamos
      if (!stdout.trim()) {
        return reject(new Error('No unstaged changes detected'));
      }

      resolve(stdout);
    });
  });
};
