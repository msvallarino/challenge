import { type ILogger, Logger } from '@libs/logging';
import type { CreateTodoInput, PatchTodoInput } from '@schemas/todo.schema';
import type { Todo } from '@models/todo.model';
import { type ITodoRepository, TodoRepository } from 'src/repositories/todo';
import { v4 as UUID } from 'uuid';
import type { ITodoService } from './types';
import { notFound } from '@hapi/boom';

type TodoServiceDependencies = Partial<{
	logger: ILogger;
	todoRepository: ITodoRepository;
}>;

export class TodoService implements ITodoService {
	logger: ILogger;
	db: ITodoRepository;

	constructor(deps: TodoServiceDependencies = {}) {
		this.logger = deps.logger ?? Logger;
		this.db = deps.todoRepository ?? new TodoRepository();
	}

	async getTodoById(todoId: string): Promise<Todo> {
		const dbResult = await this.db.getById({ todoId });

		if (dbResult === undefined) {
			throw notFound('Todo config not found');
		}

		return dbResult;
	}

	async getAllTodos(): Promise<Todo[]> {
		const dbResult = await this.db.getAll();

		if (dbResult === undefined) {
			return [];
		}

		return dbResult;
	}

	async addTodo(data: CreateTodoInput): Promise<Todo> {
		const todoToBeCreated: Todo = {
			todoId: UUID(),
			title: data.title,
			description: data.description,
			dueDate: data.dueDate,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.logger.debug('todoToBeCreated', todoToBeCreated);

		const dbResult = await this.db.create(todoToBeCreated);

		return dbResult;
	}

	async updateTodo(todoId: string, data: PatchTodoInput): Promise<Todo> {
		const existingTodo = await this.db.getById({
			todoId,
		});

		if (existingTodo == null) throw notFound('Todo does not exists');

		const todoToBePatched: Todo = {
			...existingTodo,
			...data,
			updatedAt: new Date().toISOString(),
		};

		this.logger.debug('todoToBePatched', todoToBePatched);

		const dbResult = await this.db.update(todoToBePatched);

		return dbResult;
	}

	async deleteTodo(todoId: string): Promise<Todo> {
		try {
			const dbResult = await this.db.delete({ todoId });

			return dbResult;
		} catch (error) {
			/**
			 * In our case this means that the only condition (that the todo to be deleted exists) failed,
			 * we do this to avoid doing before an extra call to the db to check if the given todo exists
			 */
			if (error.name === 'ConditionalCheckFailedException') {
				throw notFound('Todo does not exists');
			}
			throw error;
		}
	}
}
