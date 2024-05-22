import { badData, badRequest } from '@hapi/boom';
import { Logger } from '@libs/logging';
import { middyfy } from '@libs/middy/middify';
import { formatAPIGatewayResponse } from '@utils/apigateway/formatAPIGatewayResponse';
import { parseBody } from '@utils/apigateway/parseBody';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { patchTodoSchema } from '@schemas/todo.schema';
import { TodoService } from '@services/todo';

export const handlerImplementation = async (
	event: APIGatewayProxyEventV2,
	{ todoService, logger } = { todoService: new TodoService(), logger: Logger },
): Promise<APIGatewayProxyResultV2> => {
	// Required path parameters already validated by Middy pathParam middleware
	const { todoId } = event.pathParameters ?? {};
	if (todoId == null) {
		throw badRequest('Invalid todoId');
	}
	logger.debug('todoId', { todoId });

	const body = parseBody(event.body);
	const inputValidated = patchTodoSchema.safeParse(body);
	if (!inputValidated.success) {
		const errorMessage = `${(patchTodoSchema.description as string) ?? 'Validation'} failed`;
		throw badData(errorMessage, inputValidated.error.flatten());
	}
	logger.debug('inputValidated', { inputValidated });

	const updatedItem = await todoService.updateTodo(todoId, inputValidated.data);

	return formatAPIGatewayResponse({ ...updatedItem }, 200, event);
};

/**
 * Handle the API Gateway event for POST 'v1/todos'
 * @param event
 * @returns
 */
export const handler = middyfy(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	return await handlerImplementation(event);
});
