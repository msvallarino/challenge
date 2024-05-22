import { dynamoDBClient as client } from '@aws-clients/dynamoDBClient';
import {
	DeleteCommand,
	type DeleteCommandInput,
	type DynamoDBDocumentClient,
	GetCommand,
	type GetCommandInput,
	PutCommand,
	type PutCommandInput,
	ScanCommand,
	type ScanCommandInput,
} from '@aws-sdk/lib-dynamodb';
import { type ILogger, Logger } from '@libs/logging';
import { type Todo } from '@models/todo.model';
import { type ITodoRepository, type TodoKeySchema, todoDynamoDBKeySchema } from './interface';

type TodoRepositoryDependencies = Partial<{
	logger: ILogger;
	dbClient: DynamoDBDocumentClient;
}>;

const DYNAMODB_TABLE_NAME = process.env.TABLE_NAME;

export class TodoRepository implements ITodoRepository {
	logger: ILogger;
	dbClient: DynamoDBDocumentClient;
	TABLE_NAME = DYNAMODB_TABLE_NAME;

	constructor(deps: TodoRepositoryDependencies = {}) {
		this.logger = deps.logger ?? Logger;
		this.dbClient = deps.dbClient ?? client;
	}

	async getById(keys: TodoKeySchema): Promise<Todo | undefined> {
		const params: GetCommandInput = {
			TableName: this.TABLE_NAME,
			Key: {
				[todoDynamoDBKeySchema.PK]: keys.todoId,
			},
		};
		this.logger.debug('TodoRepository.getById :: GetCommandInput', params);

		const queryResult = await this.dbClient.send(new GetCommand(params));
		this.logger.info('TodoRepository.getById :: GetCommandOutput', queryResult);

		if (queryResult.Item != null) {
			return queryResult.Item as Todo;
		}

		return undefined;
	}

	async getAll(): Promise<Todo[] | undefined> {
		const params: ScanCommandInput = {
			TableName: this.TABLE_NAME,
			ReturnConsumedCapacity: 'NONE',
		};
		this.logger.debug('TodoRepository.getById :: ScanCommandInput', params);

		const queryResult = await this.dbClient.send(new ScanCommand(params));
		this.logger.info('TodoRepository.getAllByAppId :: ScanCommandOutput', queryResult);

		if (queryResult.Items != null) {
			return queryResult.Items as Todo[];
		}

		return undefined;
	}

	async create(data: Todo): Promise<Todo> {
		const params: PutCommandInput = {
			TableName: this.TABLE_NAME,
			Item: data,
		};

		this.logger.debug('TodoRepository.create :: PutCommandInput', params);

		const putResult = await this.dbClient.send(new PutCommand(params));

		this.logger.info('TodoRepository.create :: PutCommandOutput', putResult);

		return data;
	}

	// This is exactly as create, but we may want to change it implementation in the future
	// The checks and validations of existence are done in the service layer
	async update(data: Todo): Promise<Todo> {
		const params: PutCommandInput = {
			TableName: this.TABLE_NAME,
			Item: data,
		};

		this.logger.debug('TodoRepository.update :: PutCommandInput', params);

		const putResult = await this.dbClient.send(new PutCommand(params));

		this.logger.info('TodoRepository.update :: PutCommandOutput', putResult);

		return data;
	}

	async delete(keys: TodoKeySchema): Promise<Todo> {
		const params: DeleteCommandInput = {
			TableName: this.TABLE_NAME,
			Key: {
				[todoDynamoDBKeySchema.PK]: keys.todoId,
			},
			ConditionExpression: '(attribute_exists (todoId)) AND todoId = :todoId',
			ExpressionAttributeValues: {
				':todoId': keys.todoId,
			},
			ReturnValues: 'ALL_OLD',
		};

		this.logger.debug('TodoRepository.deleteById :: DeleteCommandInput', params);

		const result = await this.dbClient.send(new DeleteCommand(params));

		this.logger.info('TodoRepository.deleteById :: DeleteCommandOutput', result);

		return result.Attributes as Todo;
	}
}
