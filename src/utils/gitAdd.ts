import { execFile } from 'node:child_process';

// export const gitAdd = async (files: string): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     execFile('git', ['add', `${files}`], (error, stdout) => {
//       if (error) {
//         if (error.code === 128) {
//           return reject(new Error('Not a git repository (or any of the parent directories)'));
//         }
//         return reject(new Error(`Error executing git status: ${error.message}`));
//       }

//       if (!stdout.trim()) {
//         return reject(new Error('No changes detected in working directory'));
//       }

//       resolve(stdout);
//     });
//   });
// };

export const gitAdd = async (files: string | string[]): Promise<string> => {
  return new Promise((resolve, reject) => {
    let fileList: string[];

    // Si 'files' es una cadena, la dividimos por espacios.
    // Si ya es un array, lo usamos directamente.
    if (typeof files === 'string') {
      fileList = files.split(' ');
    } else {
      fileList = files;
    }

    // Filtramos cualquier cadena vacía que pudiera resultar de split()
    fileList = fileList.filter(f => f.trim() !== '');

    // Si no hay archivos válidos, rechazamos.
    if (fileList.length === 0) {
      return reject(new Error('No files provided to add.'));
    }

    // Creamos los argumentos para 'git add'
    const args = ['add', ...fileList];

    execFile('git', args, (error, stdout, stderr) => {
      // Agregué stderr para mejor depuración
      if (error) {
        if (error.code === 128) {
          return reject(new Error('Not a git repository (or any of the parent directories).'));
        }
        // Incluye stderr en el mensaje de error para más detalles
        return reject(new Error(`Error executing git add: ${error.message}. Stderr: ${stderr}`));
      }

      // 'git add' no suele imprimir nada en stdout si todo va bien.
      // Un stdout.trim() vacío es a menudo una señal de éxito, no de error.
      // Es mejor confiar en 'error' para detectar problemas.
      // La condición original `!stdout.trim()` es incorrecta para 'git add'.
      // Si llegamos aquí y no hay error, asumimos éxito.

      // Puedes verificar stderr si quieres capturar advertencias de Git,
      // pero para un simple add, si no hay error, todo está bien.
      resolve('Files added successfully.'); // Mensaje más descriptivo
    });
  });
};
