import { getLogger, LevelName, LogLevels, LogRecord, setup } from 'https://deno.land/std@0.203.0/log/mod.ts';
import * as handlers from 'https://deno.land/std@0.203.0/log/handlers.ts';
import * as path from 'https://deno.land/std@0.203.0/path/mod.ts';

const LOG_FILE = path.join(Deno.cwd(), 'app.log');
const LOG_LEVEL_NAME = (Deno.env.get('LOG_LEVEL') || 'DEBUG') as LevelName;
/* DEBUG = 10, INFO = 20, WARNING = 30, ERROR = 40, CRITICAL = 50 */

// Configure the logging system
setup({
  handlers: {
    console: new handlers.ConsoleHandler(LOG_LEVEL_NAME, {
      formatter: (logRecord: LogRecord) => {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${logRecord.levelName}] ${logRecord.msg}`;
      },
    }),

    file: new handlers.FileHandler(LOG_LEVEL_NAME, {
      filename: LOG_FILE,
      formatter: (logRecord: LogRecord) => {
        const timestamp = new Date().toISOString();
        return `${timestamp} [${logRecord.levelName}] ${logRecord.msg}`;
      },
    }),
  },

  loggers: {
    default: {
      level: LOG_LEVEL_NAME,
      handlers: ['console', 'file'],
    },
  },
});

export const logger = getLogger();

/** Flushes all pending logs to the file handler. This is useful in applications that do not exit cleanly. */
export async function flushLogs(): Promise<void> {
  const fileHandler = getFileHandler();
  if (fileHandler) {
    await fileHandler.flush();
  }
}

/** Gets a reference to the configured FileHandler. */
function getFileHandler(): undefined | handlers.FileHandler {
  const fileHandler = getLogger().handlers.find(
    (handler) => handler instanceof handlers.FileHandler,
  );
  if (fileHandler instanceof handlers.FileHandler) {
    return fileHandler;
  }
  return undefined;
}
