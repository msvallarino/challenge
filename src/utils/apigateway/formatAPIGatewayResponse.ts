import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { getCorsHeadersObject } from './getCorsHeadersObject';

export const formatAPIGatewayResponse = (
	response: Record<string, unknown> | object,
	statusCode: number,
	event: APIGatewayProxyEventV2,
): APIGatewayProxyResultV2 => {
	return {
		body: JSON.stringify(response),
		statusCode,
		headers: getCorsHeadersObject(event),
	};
};
