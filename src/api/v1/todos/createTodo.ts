import { badData } from '@hapi/boom';
import { Logger } from '@libs/logging';
import { middyfy } from '@libs/middy/middify';
import { formatAPIGatewayResponse } from '@utils/apigateway/formatAPIGatewayResponse';
import { parseBody } from '@utils/apigateway/parseBody';
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { createTodoSchema } from '@schemas/todo.schema';
import { TodoService } from '@services/todo';

export const handlerImplementation = async (
	event: APIGatewayProxyEventV2,
	{ todoService, logger } = { todoService: new TodoService(), logger: Logger },
): Promise<APIGatewayProxyResultV2> => {
	const body = parseBody(event.body);
	const inputValidated = createTodoSchema.safeParse(body);
	if (!inputValidated.success) {
		const errorMessage = `${(createTodoSchema.description as string) ?? 'Validation'} failed`;
		throw badData(errorMessage, inputValidated.error.flatten());
	}
	logger.debug('inputValidated', { inputValidated });

	const createdItem = await todoService.addTodo(inputValidated.data);

	return formatAPIGatewayResponse({ ...createdItem }, 201, event);
};

/**
 * Handle the API Gateway event for POST 'v1/todos'
 * @param event
 * @returns
 */
export const handler = middyfy(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
	return await handlerImplementation(event);
});
