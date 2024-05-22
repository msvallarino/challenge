import { Logger } from '@libs/logging';
import { middyfy } from '@libs/middy/middify';
import { formatAPIGatewayResponse } from '@utils/apigateway/formatAPIGatewayResponse';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { TodoService } from '@services/todo';

export const handlerImplementation = async (
	event: APIGatewayProxyEventV2,
	{ todoService, logger } = { todoService: new TodoService(), logger: Logger },
): Promise<APIGatewayProxyResultV2> => {
	const todosList = await todoService.getAllTodos();

	logger.debug('todosList', { todosList });

	return formatAPIGatewayResponse({ ...todosList }, 200, event);
};

/**
 * Handle the API Gateway event for POST 'v1/todos'
 * @param event
 * @returns
 */
export const handler = middyfy(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	return await handlerImplementation(event);
});
