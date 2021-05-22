import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import type { Todos } from 'local-ts';

import { logger } from '@@shared/utils/logger';

import { fetchTodos } from '@@services/todos/get-todos';

/**
 *  Variables that are local to this handler
 */
const LOCAL_ENV_VARIABLES = {
  /**
   * Bucket name to store user's details
   */
  userCacheBucket: process.env.USER_CACHE_BUCKET,
};

/**
 * Validates the request payload
 */
function isValidTodoRequest(payload: unknown): payload is Todos.GetTodosParams {
  if (typeof (payload as Todos.GetTodosParams).email === 'string') {
    return true;
  }
  return false;
}

export const main: APIGatewayProxyHandler = async (event) => {
  logger.debug('get-todos', 'A debug log', { data: 'Hello' });

  if (!isValidTodoRequest(event.body)) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Invalid Request' }),
    };
  }

  const serviceResponse = await fetchTodos({
    email: event.body,
    userCacheBucket: LOCAL_ENV_VARIABLES.userCacheBucket,
  });

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: JSON.stringify(serviceResponse),
  };

  return response;
};
