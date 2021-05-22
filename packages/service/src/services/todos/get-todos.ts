import type { Todos } from 'local-ts';

import { S3, PutObjectCommand } from '@aws-sdk/client-s3';

import { COMMON_GLOBALS } from '@@shared/utils/constants';

const s3Client = new S3({ region: COMMON_GLOBALS.region });

/**
 * Saves user's details to S3
 */
async function saveUserDetailsToS3Cache(params: SaveUserDetailsToS3CacheParams): Promise<void> {
  const command = new PutObjectCommand({
    Body: '{}',
    Bucket: params.userCacheBucket,
    Key: '',
  });
  await s3Client.send(command);
}

// the main function should be defined last

/**
 * Fetch a list of Todos
 */
export const fetchTodos: Todos.GetTodosHandler = async function fetchTodos(params) {
  if (params.email) {
    // no direct calls to S3, it is behind a function with a good name
    await saveUserDetailsToS3Cache({ userCacheBucket: params.userCacheBucket });
  }
  return { todos: ['Just do it!'] };
};

// define interfaces that are internal to this file at the bottom
interface SaveUserDetailsToS3CacheParams {
  userCacheBucket: string;
}
