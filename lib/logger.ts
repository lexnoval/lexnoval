// lib/logger.ts
type Level = 'info' | 'warn' | 'error';

function out(level: Level, msg: string, ctx: Record<string, unknown> = {}) {
  const line = {
    ts: new Date().toISOString(),
    level,
    env: process.env.VERCEL_ENV, // preview / production / development
    msg,
    ...ctx,
  };
  const text = JSON.stringify(line);
  if (level === 'error') console.error(text);
  else if (level === 'warn') console.warn(text);
  else console.log(text);
}

export const logger = {
  info: (msg: string, ctx?: Record<string, unknown>) => out('info', msg, ctx),
  warn: (msg: string, ctx?: Record<string, unknown>) => out('warn', msg, ctx),
  error: (msg: string, ctx?: Record<string, unknown>) => out('error', msg, ctx),
};
