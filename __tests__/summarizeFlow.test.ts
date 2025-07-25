import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { summarize } from '../src/commands/summarize';
import { PlaninResponse } from '../src/utils/PlainResponse';
import { getGitzenConfig } from '../src/utils/getGitzenConfig';
import { gitWorkingDiff } from '../src/utils/gitWorking';

import chalk from 'chalk';

vi.mock('../src/utils/gitWorking');
vi.mock('../src/utils/getGitzenConfig');
vi.mock('../src/utils/PlainResponse');
vi.mock('boxen', () => ({
  __esModule: true,
  default: vi.fn((text: string) => text),
}));

export const fakeFormatter = vi.fn((txt: string) => txt);

vi.mock('chalk', () => {
  return {
    __esModule: true,
    default: {
      cyan: vi.fn((txt: string) => txt),
      green: vi.fn((txt: string) => txt),
      yellow: vi.fn((txt: string) => txt),
      red: vi.fn((txt: string) => txt),

      hex: vi.fn(() => fakeFormatter),
    },
  };
});

const processExitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
  throw new Error('process.exit called');
});

export const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

describe('summarize command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should exit with code 1 if gitAllChanges fails', async () => {
    // Arrange: configuración mockeada
    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'conventional',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });

    // Hacemos que gitAllChanges rechace con un error
    const gitError = new Error('Git failure');
    vi.mocked(gitWorkingDiff).mockRejectedValue(gitError);

    // Act & Assert: como process.exit está espiado para lanzar, usamos rejects.toThrow
    await expect(summarize(undefined)).rejects.toThrow('process.exit called');

    // Comprueba que salimos con el código 1
    expect(processExitSpy).toHaveBeenCalledWith(1);
  });

  it('should generate a summary', async () => {
    const mockDiff = 'diff --git a/file.js b/file.js\n+console.log("test");';
    const mockResponse =
      'Added debug logs to file.js (console.log(test)). Refactored processData to separate validation from transformation for clarity. Updated ESLint to ignore max-line-length in comments and fixed a typo in userData.';

    vi.mocked(getGitzenConfig).mockReturnValue({
      template: 'commitlint',
      model: 'gpt-3.5-turbo',
      size: '36–50 characters',
      language: 'en',
      provider: 'openai',
    });
    vi.mocked(gitWorkingDiff).mockResolvedValue(mockDiff);
    vi.mocked(PlaninResponse).mockResolvedValue(mockResponse);

    await summarize(undefined);

    expect(getGitzenConfig).toBeCalled();
    expect(gitWorkingDiff).toBeCalled();

    expect(PlaninResponse).toBeCalled();

    expect(PlaninResponse).toHaveResolvedWith(mockResponse);

    expect(chalk.hex).toHaveBeenCalledWith('#8FBCBB');
    // Y que el formatter recibió el texto
    expect(fakeFormatter).toHaveBeenCalledWith(mockResponse);
  });
});
