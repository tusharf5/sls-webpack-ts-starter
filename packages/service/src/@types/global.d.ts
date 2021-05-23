declare const GLOBAL_VAR_SERVICE_NAME: string;
declare const GLOBAL_VAR_SLS_STAGE: string;
declare const GLOBAL_VAR_NODE_ENV: string;
declare const GLOBAL_VAR_REGION: string;

declare namespace NodeJS {
  export interface ProcessEnv {
    region: string;
    NODE_ENV: string;
    USER_CACHE_BUCKET: string;
  }
}
