# todo-service

## Install

```bash
# Install dependencies
yarn install
```

## Development

### Global Variables

Webpack adds some global variables to the project and it replaces all the usage of varaibles starting from `GLOBAL_VAR_*` with
their values during build time. These variables are defined in the `webpack.config.js`.

### API Gateway-like local dev server

To spin up a local dev server that will more closely match the API Gateway endpoint/experience:

```bash
yarn serve:watch
```

### Adding new functions/files to Webpack

When you add a new function to your serverless config, you don't need to also add it as a new entry
for Webpack. The `serverless-webpack` plugin allows us to follow a simple convention in our `serverless.yml`
file which is uses to automatically resolve your function handlers to the appropriate file:

```yaml
functions:
  hello-world:
    handler: src/hello.default
```

As you can see, the path to the file with the function has to explicitly say where the handler
file is. (If your function weren't the default export of that file, you'd do something like:
`src/hello.namedExport` instead.)

## Code Structuring

### Commits

Commit format.

```shell
type(scope1, scope2): message
```

Commit Types.

- **feat** (_Features_) ✨ - A new feature
- **fix** (_Bug Fixes_) 🐛 - A bug fix
- **docs** (_Documentation_) 📚 - Documentation only changes
- **style** (_Styles_) 💎 - Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **refactor** (_Code Refactoring_) 📦 - A code change that neither fixes a bug nor adds a feature
- **perf** (_Performance Improvements_) 🚀 - A code change that improves performance
- **test** (_Tests_) 🚨 - Adding missing tests or correcting existing tests
- **build** (_Builds_) 🛠 - Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- **ci** (_Continuous Integrations_) ⚙️ - Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- **chore** (_Chores_) ♻️ - Other changes that don't modify src or test files
- **revert** (_Reverts_) 🗑 - Reverts a previous commit

Examples.

```shell
git commit -m "feat(service, todos): Add delete todo api endpoint
git commit -m "fix(service, user): Remove deprecated field from user interface
git commit -m "feat(resources, sns): Add SNS topic for sending user events
git commit -m "fix(resources, lambda): Restrict IAM policies for dynamodb
```

### Logging

You can import logger from any file by adding the following line.

```ts
import { logger } from '@@shared/utils/logger';

// You have the following methods available to use from logger.
logger.debug('get-todo', 'A debug log.');
logger.info('delete-todo', 'Your message here.');
logger.http('todo-cleanup-cron', 'Your message here.');
logger.error('delete-todo', 'Your message here.');
logger.warn('get-todo', 'Your message here.');
logger.crit('update-todo', 'Your message here.');

// To add json output with your messages, use folliwing
logger.debug('todo-cleanup-cron', 'Your message here.', { data: YOUR_JSON_OBJECT });
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
function toString() {}
```

### Serverless

Lambda functions are always typed in kebab-case. Ex. `get-content`.

Environment variables are always types in Upper Case. Ex. `NODE_ENV`.

Environment variables are always scoped locally to functions even if it is duplicated across many. This means
Environment variables are not defined globally in the `environment` field.

API gateway paths are always defined by using the `_` keyword instead of `-`. Ex. `/api/get_email`.
