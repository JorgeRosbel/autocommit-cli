import { program } from 'commander';
import { start } from '@/commands/start';
import { commit } from '@/commands/commit';
import { summarize } from '@/commands/summarize';
import { batchCommit } from '@/commands/batch';
import { customHelp, HelpText } from './commands/gitzen_';
import { review } from '@/commands/review';

program.name('gitzen').addHelpText('beforeAll', () => HelpText);

program.configureHelp({
  formatHelp: () => customHelp,
});

program
  .command('start')
  .description('Init cli config')
  .action(() => {
    start();
  });

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

program
  .command('review')
  .description(
    'This command provides a summary of the changes made in both the staging area and the working'
  )
  .option('-l, --lang <code>')
  .action(opts => {
    const { lang } = opts;
    review(lang);
  });

process.on('unhandledRejection', error => {
  console.error('Error inesperado:', error);
  process.exit(1);
});

program.parse(process.argv);
