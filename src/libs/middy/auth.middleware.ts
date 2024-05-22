import { ServiceConstants } from '@ServiceConstants';
import { unauthorized } from '@hapi/boom';
import type middy from '@middy/core';
import type { APIGatewayProxyEventV2 } from 'aws-lambda';

const SECURITY_KEY = process.env.SECURITY_KEY;

const authMiddleware = (): middy.MiddlewareObj => {
	const authCheck: middy.MiddlewareFn<APIGatewayProxyEventV2> = async (request) => {
		const event = request.event;

		// This is a really simple user authentication, ideally this should consist in a more robust solution
		const authHeader: string | undefined = event?.headers?.[ServiceConstants.authHeader];

		if (authHeader == null || SECURITY_KEY !== authHeader) {
			throw unauthorized(`Unauthorized Access, incorrect or missing auth header "${ServiceConstants.authHeader}"`);
		}
	};

	return {
		before: authCheck,
	};
};

export default authMiddleware;
