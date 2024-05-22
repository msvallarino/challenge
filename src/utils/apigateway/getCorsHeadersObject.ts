import type { APIGatewayProxyEventV2 } from 'aws-lambda';

export const getCorsHeadersObject = (event: APIGatewayProxyEventV2): Record<string, string | number | boolean> => {
	// If event.httpMethod is not set, is null, or is empty then default to 'GET'. Otherwise, use event.httpMethod's value.
	const httpMethod = event?.requestContext?.http?.method;
	const method = `${httpMethod != null && httpMethod !== '' ? httpMethod : 'GET'},OPTIONS`;

	// If event.headers.origin is set, use it, otherwise fall back to '*'
	const origin = event?.headers?.origin != null && event?.headers?.origin !== '' ? event.headers.origin : '*';

	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Credentials': true,
		'Access-Control-Allow-Methods': method,
		'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
		'Content-Type': 'application/json',
	};
};
