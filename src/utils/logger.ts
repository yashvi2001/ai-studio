/**
 * Development-only logger utility
 * Only logs messages when running in development mode
 */

const isDevelopment =
  typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.includes('localhost'));

export const devLog = {
  log: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(...args);
    }
  },

  warn: (...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(...args);
    }
  },

  error: (...args: unknown[]) => {
    if (isDevelopment) {
      console.error(...args);
    }
  },

  group: (...args: unknown[]) => {
    if (isDevelopment) {
      console.group(...args);
    }
  },

  groupEnd: () => {
    if (isDevelopment) {
      console.groupEnd();
    }
  },
};
