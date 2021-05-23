import { Utils } from 'local-ts';

/**
 * Logs the parameters to the console
 */
function log(
  level: Utils.LogLevels,
  message: string,
  component: Utils.LogComponents = 'missing',
  meta: Utils.LogMeta = {}
): void {
  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      level,
      message,
      meta: meta,
      date: new Date().toISOString(),
      component: component,
      service: GLOBAL_VAR_SERVICE_NAME,
      env: GLOBAL_VAR_NODE_ENV,
    })
  );
}

const logger: Record<
  Utils.LogLevels,
  (component: Utils.LogComponents, message: string, meta?: Utils.LogMeta) => void
> = {
  error: (component, message, meta?) => {
    log('error', message, component, meta);
  },
  warn: (component, message, meta?) => {
    log('warn', message, component, meta);
  },
  info: (component, message, meta?) => {
    log('info', message, component, meta);
  },
  http: (component, message, meta?) => {
    log('http', message, component, meta);
  },
  debug: (component, message, meta?) => {
    log('debug', message, component, meta);
  },
  crit: (component, message, meta?) => {
    log('crit', message, component, meta);
  },
};

export { logger };
