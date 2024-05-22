import { isBoom } from '@hapi/boom';
import { Logger as logger } from '@libs/logging';
import type middy from '@middy/core';
import { formatAPIGatewayResponse } from '@utils/apigateway/formatAPIGatewayResponse';
import type { APIGatewayProxyResultV2 } from 'aws-lambda';

const errorHandler = (): middy.MiddlewareObj => {
	const errorHandlerOnError: middy.MiddlewareFn = async (request) => {
		const error = request.error;
		let formattedError: APIGatewayProxyResultV2 = formatAPIGatewayResponse(
			{
				type: 'Internal Server Error',
				message: 'An unknown error occurred while processing this request.',
			},
			500,
			request.event,
		);

		if (isBoom(error)) {
			logger.error(`Boom Error encountered: ${error.message}`);
			formattedError = formatAPIGatewayResponse(error.output, error.output.statusCode, request.event);
		} else if (error instanceof Error) {
			logger.fatal(`Unexpected Error encountered: ${error.message}`);
		} else {
			// Handle weird unknown errors
			logger.fatal('Unknown error encountered. This occurs as the result of a throw occurring without a type of Error.');
		}

		request.response = formattedError;
	};

	return {
		onError: errorHandlerOnError,
	};
};

export default errorHandler;
