declare module 'local-ts' {
  namespace Utils {
    type LogComponents = 'get-todos' | 'missing';
    type LogLevels = 'debug' | 'http' | 'info' | 'warn' | 'error' | 'crit';
    interface LogMeta {
      // define loggable properties here
      data?: unknown;
      metric?: 'TODO_DB_CALL_DURATION';
    }
  }

  namespace Todos {
    interface GetTodosParams {
      email: string;
      userCacheBucket: string;
    }
    interface GetTodosResponse {
      todos: string[];
    }
    export type GetTodosHandler = (params: GetTodosParams) => Promise<GetTodosResponse>;
  }
}
