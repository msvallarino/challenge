import { Logger as logger } from '@libs/logging';
import type middy from '@middy/core';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

const logInputOutput = (): middy.MiddlewareObj => {
	const logBefore: middy.MiddlewareFn<APIGatewayProxyEventV2> = async ({ event, context }) => {
		logger.info('Request Event', { event });
		logger.debug('Request context', { context });
	};

	const logAfter: middy.MiddlewareFn<APIGatewayProxyEventV2> = async ({ response }) => {
		logger.info('Request Response', { response });
	};

	return {
		before: logBefore,
		after: logAfter,
	};
};

export default logInputOutput;
