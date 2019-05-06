## Introduction
- This project uses lambda and dynamodb
- For deployment and running its using [serverless framework](https://serverless.com/)

## Solution
For limiting number of active streams there are 2 endpoints:
- `start` endpoint increment stream count
- `end` endpoint decrement stream count
- After reaching limit these endpoints reject request (403 forbidden) with relevant message.

## Implementation
- These are Implemented as atomic counters in dynamodb
- They make a single call to dynamodb to update and get the count
- And are protected by conditional clause of dynamo db to limit count between 0 and 3

## Scaling
Since its implemented as atomic counter, whole service can horizontally scaled without
any constraints (only limited by lambda or dynamodb limits)

## Setup
- Run `npm install` for setting up dependencies
- Run `npm lint` and `npm test` for linting and testing
- Please check `Running Locally` or `Running Remotely` headings for further details
   
## Running Locally
To run locally project uses `serverless-offline` to simulate lambda and local dynamodb provided by aws
- Start local dynamo db using `npm run dynamodb`
- Start local lambda using `npm start`
- For testing start request (run 4 times to get maximum streams error):
```
curl --request POST \
     --url http://localhost:3000/stream/start \
     --header 'content-type: application/json' \
     --data '{"userId": "1"}'
```
- For testing end request (run 4 times to get no active stream error):
```
curl --request POST \
  --url http://localhost:3000/stream/end \
  --header 'content-type: application/json' \
  --data '{"userId": "1"}'
```

## Deployment
- To deploy lambda and dynamo db its using serverless framework (which internally deploys cloudformation templates)
- IAM, Lambda, API gateway and dynamodb config/schema are defined in `serverless.yml`
- Use `npm run deploy` to deploy everything for current aws user (picked from `~/.aws/credentials`)
- Use `npm run undeploy` to delete everything
- For logs use `npm run logs-startFn` and `npm run logs-endFn`

## Running Remotely:
(I haven't setup a custom dns entry for this, so endpoint changes after every deploy.
But this can be easily done using serverless-domain-manager plugin or manually)

- For testing start request (run 4 times to get maximum streams error):
```
curl --request POST \
     --url https://muemofqb3d.execute-api.eu-west-2.amazonaws.com/dev/stream/start \
     --header 'content-type: application/json' \
     --data '{"userId": "1"}'
```
- For testing end request (run 4 times to get no active stream error):
```
curl --request POST \
  --url https://muemofqb3d.execute-api.eu-west-2.amazonaws.com/dev/stream/end \
  --header 'content-type: application/json' \
  --data '{"userId": "1"}'
```
