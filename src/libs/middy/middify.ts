import middy, { type MiddyfiedHandler } from '@middy/core';
import authMiddleware from './auth.middleware';
import errorHandlerMiddleware from './errorHandler.middleware';
import inputOutputLogger from './logInputOutput.middleware';

export const middyfy = (lambdaHandler): MiddyfiedHandler => {
	return middy(lambdaHandler).use(inputOutputLogger()).use(authMiddleware()).use(errorHandlerMiddleware());
};
