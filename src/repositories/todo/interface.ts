import { type Todo } from '@models/todo.model';

type ValueOf<T> = T[keyof T];
type TransformSchema<T extends Record<string, string>> = {
	[K in ValueOf<T>]: string;
};

export const todoDynamoDBKeySchema = {
	PK: 'todoId',
} as const;
export type TodoKeySchema = TransformSchema<typeof todoDynamoDBKeySchema>;

export interface ITodoRepository {
	getById: (keys: TodoKeySchema) => Promise<Todo | undefined>;
	getAll: () => Promise<Todo[] | undefined>;
	create: (data: Todo) => Promise<Todo>;
	update: (data: Todo) => Promise<Todo>;
	delete: (keys: TodoKeySchema) => Promise<Todo>;
}
