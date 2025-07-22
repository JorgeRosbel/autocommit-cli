import { execFile } from 'node:child_process';

export const gitAdd = async (files: string | string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    let fileList: string[];

    if (typeof files === 'string') {
      fileList = files.split(' ');
    } else {
      fileList = files;
    }

    fileList = fileList.filter(f => f.trim() !== '');

    if (fileList.length === 0) {
      return reject(new Error('No files provided to add.'));
    }

    // Creamos los argumentos para 'git add'
    const args = ['add', ...fileList];

    execFile('git', args, (error, _, stderr) => {
      if (error) {
        if (error.code === 128) {
          return reject(new Error('Not a git repository (or any of the parent directories).'));
        }

        return reject(new Error(`Error executing git add: ${error.message}. Stderr: ${stderr}`));
      }

      resolve('✔ Files added successfully.');
    });
  });
};
