import { program } from 'commander';
import { start } from './commands/start';
import { commit } from './commands/commit';

program.name('autocommit').description('CLI para commits automáticos');

// Comando de inicio
program
  .command('start')
  .description('Muestra un mensaje de bienvenida')
  .action(() => {
    start();
  });

// Comando de commit
program
  .command('commit')
  .description('Realiza un commit automático')
  .action(() => {
    commit();
  });

// Mostrar ayuda por defecto
if (process.argv.length <= 2) {
  program.outputHelp();
  console.log('\nEjecuta autocommit start para comenzar');
  process.exit(0);
}

// Manejar errores no capturados
process.on('unhandledRejection', error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});

// Ejecutar el comando
program.parse(process.argv);
