import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { healthcheck } from './functions/healthcheck/resource'
import { HttpIamAuthorizer, HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { CorsHttpMethod, HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { Stack } from 'aws-cdk-lib';

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  healthcheck
});

const apiStack = backend.createStack('api-stack')

const iamAuthorizer = new HttpIamAuthorizer();

const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  "userPoolAuthorizer",
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient]
  }
)

const httpHealthcheckLambdaIntegration = new HttpLambdaIntegration(
  "healthcheckLambdaIntegration",
  backend.healthcheck.resources.lambda
)

const httpApi = new HttpApi(apiStack, "httpApi", {
  apiName: "httpApi",
  description: "httpApi description",
  corsPreflight: {
    allowMethods: [CorsHttpMethod.GET],
    allowHeaders: ["*"],
    allowOrigins: ["*"],
  },
  createDefaultStage: true,
})

httpApi.addRoutes({
  path: "/api/health-check",
  methods: [HttpMethod.GET],
  integration: httpHealthcheckLambdaIntegration,
})

backend.addOutput({
  custom: {
    API: {
      "/api/health-check": {
        url: `${httpApi.url!}api/health-check`,
        endpoint: httpApi.apiEndpoint,
        region: Stack.of(httpApi).region,
        apiName: "Health Check API",
      }
    }
  }
})