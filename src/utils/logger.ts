const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  grey: '\x1b[90m',
};

function timestamp(): string {
  return new Date().toISOString();
}

export const logger = {
  info(message: string, ...args: unknown[]): void {
    console.log(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.blue}[INFO]${colors.reset}`, message, ...args);
  },

  success(message: string, ...args: unknown[]): void {
    console.log(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.green}[SUCCESS]${colors.reset}`, message, ...args);
  },

  warn(message: string, ...args: unknown[]): void {
    console.log(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.yellow}[WARN]${colors.reset}`, message, ...args);
  },

  error(message: string, ...args: unknown[]): void {
    console.error(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.red}[ERROR]${colors.reset}`, message, ...args);
  },

  debug(message: string, ...args: unknown[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.magenta}[DEBUG]${colors.reset}`, message, ...args);
    }
  },

  event(eventName: string, guildName: string): void {
    console.log(`${colors.grey}[${timestamp()}]${colors.reset} ${colors.cyan}[EVENT]${colors.reset}`, `${eventName} in ${guildName}`);
  },
};
