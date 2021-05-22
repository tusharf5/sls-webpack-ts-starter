declare const GLOBAL_VAR_SERVICE_NAME: string;

declare namespace NodeJS {
  export interface ProcessEnv {
    region: string;
    NODE_ENV: string;
    USER_CACHE_BUCKET: string;
  }
}
