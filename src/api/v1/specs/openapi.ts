import { ServiceConstants } from '@ServiceConstants';
import { todoModel as Todo } from '@models/todo.model';
import { createTodoSchema, patchTodoSchema } from '@schemas/todo.schema';
import type { APIGatewayProxyResultV2 } from 'aws-lambda';
import { createDocument } from 'zod-openapi';
import { type ParameterObject } from 'zod-openapi/lib-types/openapi3-ts/dist/oas30';

const securityHeaderConfig: ParameterObject = {
	name: ServiceConstants.authHeader,
	in: 'header',
	description: 'A unique key - per environment - that allows the use of this API',
	required: true,
	schema: {
		type: 'string',
	},
};

const todoIdPathParameter: ParameterObject = {
	name: 'todoId',
	in: 'path',
	description: 'The todo Id to be find.',
	required: true,
	schema: {
		type: 'string',
	},
};

/* istanbul ignore next */
export const handler = async (): Promise<APIGatewayProxyResultV2> => {
	const openApiDocument = createDocument({
		openapi: '3.1.0',
		info: {
			title: 'Challenge - Todo App API',
			version: '1.0.0',
		},
		servers: [
			{
				url: 'https://yrl9sij6o4.execute-api.us-east-1.amazonaws.com',
				description: 'AWS APIGateway',
			},
		],
		paths: {
			'/v1/todos': {
				post: {
					summary: 'Create a new Todo item.',
					parameters: [securityHeaderConfig],
					requestBody: {
						content: {
							'application/json': { schema: createTodoSchema },
						},
					},
					responses: {
						'201': {
							description: 'Created',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Todo',
									},
								},
							},
						},
						401: {
							$ref: '#/components/responses/401',
						},
						422: {
							$ref: '#/components/responses/422',
						},
					},
				},
				get: {
					summary: 'Get a list of existing Todos.',
					parameters: [securityHeaderConfig],
					responses: {
						'200': {
							description: 'Items founds',
							content: {
								'application/json': {
									schema: {
										type: 'object',
										properties: {
											items: {
												type: 'array',
												items: {
													$ref: '#/components/schemas/Todo',
												},
											},
										},
									},
								},
							},
						},
						401: {
							$ref: '#/components/responses/401',
						},
					},
				},
			},
			'/v1/todos/{todoId}': {
				get: {
					summary: 'Get a todo item by id',
					parameters: [securityHeaderConfig, todoIdPathParameter],
					responses: {
						'200': {
							description: 'Item found',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Todo',
									},
								},
							},
						},
						401: {
							$ref: '#/components/responses/401',
						},
						404: {
							$ref: '#/components/responses/404',
						},
					},
				},
				patch: {
					summary: 'Update a todo item',
					parameters: [securityHeaderConfig, todoIdPathParameter],
					requestBody: {
						content: {
							'application/json': { schema: patchTodoSchema },
						},
					},
					responses: {
						'200': {
							description: 'Item updated',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Todo',
									},
								},
							},
						},
						400: {
							$ref: '#/components/responses/400',
						},
						401: {
							$ref: '#/components/responses/401',
						},
						404: {
							$ref: '#/components/responses/404',
						},
					},
				},
				delete: {
					summary: 'Delete a todo item',
					parameters: [securityHeaderConfig, todoIdPathParameter],
					responses: {
						'200': {
							description: 'Item deleted',
							content: {
								'application/json': {
									schema: {
										$ref: '#/components/schemas/Todo',
									},
								},
							},
						},
						400: {
							$ref: '#/components/responses/400',
						},
						401: {
							$ref: '#/components/responses/401',
						},
						404: {
							$ref: '#/components/responses/404',
						},
					},
				},
			},
		},
		components: {
			schemas: {
				ErrorSchema: {
					type: 'object',
					properties: {
						statusCode: {
							type: 'number',
							example: '400',
						},
						error: {
							type: 'string',
							example: 'badRequest',
						},
						message: {
							type: 'string',
							example: 'The request body or one or more of the query parameters was not well formed.',
						},
						data: {
							type: 'string',
							example: 'Reasons...',
						},
					},
					required: ['code', 'type', 'message'],
				},
				Todo,
			},
			responses: {
				400: {
					description: 'Bad Request',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorSchema',
							},
							examples: {
								'Bad Request': {
									value: {
										statusCode: 400,
										error: 'Bad Request',
										message: 'bad todoId',
									},
								},
							},
						},
					},
				},
				401: {
					description: 'Unauthorized Access, incorrect or missing auth header "x-api-key"',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorSchema',
							},
							examples: {
								'Invalid User Credentials': {
									value: {
										statusCode: '401',
										error: 'unauthorized',
										message: 'Unauthorized Access, incorrect or missing auth header "x-api-key"',
									},
								},
							},
						},
					},
				},
				404: {
					description: 'Not Found',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorSchema',
							},
							examples: {
								'Item Not Found': {
									value: {
										statusCode: '404',
										error: 'Not Found',
										message: 'Resource not found',
									},
								},
							},
						},
					},
				},
				422: {
					description: 'Unprocessable Content',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorSchema',
							},
							examples: {
								'Unprocessable Content': {
									value: {
										statusCode: '422',
										error: 'Unprocessable Content',
										message: 'Incorrect input data',
									},
								},
							},
						},
					},
				},
			},
		},
	});

	const html = `<!DOCTYPE html><html lang=en>
	<head>
		<meta charset=UTF-8 />
		<title>VIZIO Platform API - Partner Services</title>
		<link rel=stylesheet href=https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css />
	</head>
	<body>
		<div id=swagger></div>
		<script src=https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js crossorigin=''></script>
		<script>
			window.onload = function() {
				const spec = ${JSON.stringify(openApiDocument)};
				SwaggerUIBundle({
				dom_id: '#swagger',
				spec: spec,
				});
			}
		</script>
	</body>
</html>`;

	return {
		statusCode: 200,
		headers: {
			'Content-Type': 'text/html',
		},
		body: html,
	};
};
