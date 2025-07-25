// tests/commitFlow.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { commit } from '../src/commands/commit';
import { gitCommitAsync } from '../src/utils/gitCommit';
import { gitStaging } from '../src/utils/gitStaging';
import { getGitzenConfig } from '../src/utils/getGitzenConfig';
import { PlaninResponse } from '../src/utils/PlainResponse';
import inquirer from 'inquirer';

// Mock de las dependencias
vi.mock('../src/utils/gitCommit');
vi.mock('../src/utils/gitStaging');
vi.mock('../src/utils/getGitzenConfig');
vi.mock('../src/utils/PlainResponse');
vi.mock('inquirer');
vi.mock('boxen', () => ({ default: vi.fn(text => text) }));
vi.mock('chalk', () => ({
  default: {
    cyan: vi.fn(text => text),
    green: vi.fn(text => text),
    red: vi.fn(text => text),
  },
}));

const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

describe('commit command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should exit when there is nothing to commit', async () => {
    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitStaging).mockResolvedValue('');

    await expect(commit(false, false)).rejects.toThrow('process.exit called');
    expect(processExitSpy).toHaveBeenCalledWith(0);
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Nothing to commit'));
  });

  it('should generate commit message and ask for confirmation', async () => {
    const mockDiff = 'diff --git a/file.js b/file.js\n+console.log("test");';
    const mockCommitMessage = 'feat: add console log for testing';

    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitStaging).mockResolvedValue(mockDiff);
    vi.mocked(PlaninResponse).mockResolvedValue(mockCommitMessage);
    vi.mocked(inquirer.prompt).mockResolvedValue({ git_commit: true });
    vi.mocked(gitCommitAsync).mockResolvedValue('Commit successful');

    await commit(false, false);

    expect(gitStaging).toHaveBeenCalled();
    expect(PlaninResponse).toHaveBeenCalledWith({
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      system_prompt: expect.stringContaining('expert developer'),
      prompt: expect.stringContaining(mockDiff),
    });
    expect(inquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'confirm',
        name: 'git_commit',
        message: 'Do you want to commit with the previous message?',
        default: true,
      },
    ]);
    expect(gitCommitAsync).toHaveBeenCalledWith(mockCommitMessage, false);
  });

  it('should auto-accept commit when autoAccept is true', async () => {
    const mockDiff = 'diff --git a/file.js b/file.js\n+console.log("test");';
    const mockCommitMessage = 'feat: add console log for testing';

    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitStaging).mockResolvedValue(mockDiff);
    vi.mocked(PlaninResponse).mockResolvedValue(mockCommitMessage);
    vi.mocked(gitCommitAsync).mockResolvedValue('Commit successful');

    await commit(true, false);

    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(gitCommitAsync).toHaveBeenCalledWith(mockCommitMessage, false);
  });

  it('should handle edit mode correctly', async () => {
    const mockDiff = 'diff --git a/file.js b/file.js\n+console.log("test");';
    const mockCommitMessage = 'feat: add console log for testing';

    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitStaging).mockResolvedValue(mockDiff);
    vi.mocked(PlaninResponse).mockResolvedValue(mockCommitMessage);
    vi.mocked(gitCommitAsync).mockResolvedValue('Commit successful');

    await commit(false, true);

    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(gitCommitAsync).toHaveBeenCalledWith(mockCommitMessage, true);
  });

  it('should not commit when user declines', async () => {
    const mockDiff = 'diff --git a/file.js b/file.js\n+console.log("test");';
    const mockCommitMessage = 'feat: add console log for testing';

    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitStaging).mockResolvedValue(mockDiff);
    vi.mocked(PlaninResponse).mockResolvedValue(mockCommitMessage);
    vi.mocked(inquirer.prompt).mockResolvedValue({ git_commit: false });

    await commit(false, false);

    expect(gitCommitAsync).not.toHaveBeenCalled();
  });
});
