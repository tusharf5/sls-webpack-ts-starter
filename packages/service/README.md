# todo-service

## Install

```bash
# Install dependencies
yarn install
```

## Development

### API Gateway-like local dev server

To spin up a local dev server that will more closely match the API Gateway endpoint/experience:

```bash
yarn serve
```

### Adding new functions/files to Webpack

When you add a new function to your serverless config, you don't need to also add it as a new entry
for Webpack. The `serverless-webpack` plugin allows us to follow a simple convention in our `serverless.yml`
file which is uses to automatically resolve your function handlers to the appropriate file:

```yaml
functions:
  hello:
    handler: src/hello.default
```

As you can see, the path to the file with the function has to explicitly say where the handler
file is. (If your function weren't the default export of that file, you'd do something like:
`src/hello.namedExport` instead.)

### Pruning old versions of deployed functions

The Serverless framework doesn't purge previous versions of functions from AWS, so the number of previous versions can grow out of hand and eventually filling up your code storage. This starter kit includes [serverless-prune-plugin](https://github.com/claygregory/serverless-prune-plugin) which automatically prunes old versions from AWS. The config for this plugin can be found in `serverless.yml` file. The defaults are:

```yaml
custom:
  prune:
    automatic: true
    number: 5 # Number of versions to keep
```

The above config removes all but the last five stale versions automatically after each deployment.

Go [here](https://medium.com/fluidity/the-dark-side-of-aws-lambda-5c9f620b7dd2) for more on why pruning is useful.

## Code Structuring

### Logging

You can import logger from any file by adding the following line.

```ts
import { logger } from '@@shared/utils/logger';

// You have the following methods available to use from logger.
logger.debug('A debug log.');
logger.info('Your message here.');
logger.http('Your message here.');
logger.error('Your message here.');
logger.warn('Your message here.');
logger.crit('Your message here.');

// To add json output with your messages, use folliwing
logger.debug('Your message here.', { info: YOUR_JSON_OBJECT });
```

### Import

Imports are structured in the following order.

1. Type imports. `import type { Module } from 'lib';`
1. Fixed path imports. `import { module } from 'lib';`
1. Relative path imports. `import { module } from '../';`

### Utilities

We have the following utilties shared across all modules.

- **constants** - _A place for all the constants._
- **fns** - _A place for all the generic utility functions._ _Not any AWS service specific._
- **metrics** - _A place for all the cloudwatch metrics related stuff like log prefixes, suffixes, text._
- **aws/lambda** - _A place for all the common lambda related stuff._
- **aws/dynamodb** - _A place for all the common dynamodb related stuff._

### Handler functions

To find out types for a integration. Cmd + Click on the `'aws-lambda'` import and find out the integration.

#### API Gateway Proxy

```ts
import type { APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

import { logger } from '@@shared/utils/logger';

export const main: APIGatewayProxyHandler = async (event) => {
  logger.debug('A debug log', { info: { hhhh: 'sssss', lll: { l: 'lll' } } });

  const response: APIGatewayProxyResult = {
    statusCode: 200,
    body: '{}',
  };

  return response;
};
```

#### SQS Handler

```ts
import type { SQSHandler } from 'aws-lambda';

import { logger } from '@@shared/utils/logger';

export const main: SQSHandler = async (event) => {
  logger.debug('A debug log', { info: { hhhh: 'sssss', lll: { l: 'lll' } } });

  event.Records[0].body;
};
```

### Lambda Structuring

Handlers are grouped by service name. `src/handlers/<service>/<handler-file-name>.ts`

Each file has just one handler since we already group them in a single folder by service name.

The name of the exported handler function is always `main`.

This is also one reason we only have one handler per file.

Lambda handlers do not contain any logic. They act as an interface to the services which contains the logic.
Lambda provides input to services and services respond back with data which then lambda can send back.
Service also does not know what environment variable it has. Lambda needs to provide the environment variables to it.

Service code does not have anything lambad specific. It has pure JS and logic.

```shell
Outside World ----> Lambda ----> Services
```

### Service Definitions

Each function in a service only accepts one parameter. That is `params`.

We define each service function in `types/local-ts.d.ts` and inside of it in the namespace of that service.

We use these definitions in the service file.

#### services/email/personalize-email.ts

```ts
import type { Email } from 'local-ts';

export const personalizeEmail: Email.PersonalizeEmail = async function personalizeEmail(params) {
  return {};
};
```

#### types/local-ts.d.ts

```ts
declare module 'local-ts' {
  namespace Email {
    interface PersonalizeEmailParams {}
    interface PersonalizeEmailResponse {}
    export type PersonalizeEmail = (
      params: PersonalizeEmailParams
    ) => Promise<PersonalizeEmailResponse>;
  }
}
```

### JSDoc

Since the project uses typescript so we don't provide full jsdoc comment attributes. But adding a description to each function is set to be required and will throw a compilation error if missing.

```ts
/**
 * Converts an object to a string
 */
function toString() {

}
```