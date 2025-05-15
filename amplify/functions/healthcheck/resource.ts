import { defineFunction } from '@aws-amplify/backend';

export const healthcheck = defineFunction({
  name: 'healthcheck-apt',
  entry: './handler.ts'
});