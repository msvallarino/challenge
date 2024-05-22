import { type LogLevel } from '@libs/logging';

export const ServiceConstants = {
	serviceName: 'todo-challenge',
	region: process.env.REGION ?? 'us-east-1',
	stage: process.env.ENVIRONMENT,
	lambda_name: process.env.AWS_LAMBDA_FUNCTION_NAME,
	logLevel: process.env.LOG_LEVEL as LogLevel,
	authHeader: 'x-api-key',
} as const;
