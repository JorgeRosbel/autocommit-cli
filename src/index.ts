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
  .description(
    'This command provides a summary of the changes made in both the staging area and the working'
  )
  .option('-l, --lang <code>')
  .action(opts => {
    const { lang } = opts;
    summarize(lang);
  });

program
  .command('batch')
  .description(
    'Gitzen uses AI to automatically analyze your unstaged changes, group them into logical blocks (e.g., new features, refactors, dependency updates), assign them a priority, and generate a separate commit for each group in order of importance.'
  )
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
