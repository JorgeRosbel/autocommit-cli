import { program } from 'commander';
import { start } from './commands/start';
import { commit } from './commands/commit';
import { summarize } from './commands/summarize';
import { batchCommit } from './commands/batch';

program.name('gitzen').description('CLI para commits automáticos');

// Comando de inicio
program
  .command('start')
  .description('AI-powered CLI tool for automatic git commit message generation')
  .action(() => {
    start();
  });

// Comando de commit
program
  .command('commit')
  .description('Automatically generates and performs a commit using AI.')
  .action(() => {
    commit();
  });

program
  .command('summarize')
  .description('')
  .option('-l, --lang <code>')
  .action(opts => {
    const { lang } = opts;
    summarize(lang);
  });

program
  .command('batch')
  .description('Automatically generates and performs a commit using AI.')
  .action(() => {
    batchCommit();
  });

// Mostrar ayuda por defecto
if (process.argv.length <= 2) {
  program.outputHelp();
  console.log('\nRun "gitzen start" to initialize the setup');
  process.exit(0);
}

// Manejar errores no capturados
process.on('unhandledRejection', error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});

// Ejecutar el comando
program.parse(process.argv);
