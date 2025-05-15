import type { APIGatewayProxyHandlerV2 } from 'aws-lambda';

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  console.log("event", event);

  return {
    statusCode: 200,
    body: 'OK'
  };
};