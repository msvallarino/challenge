import type { CreateTodoInput, PatchTodoInput } from '@schemas/todo.schema';
import type { Todo } from '@models/todo.model';

export interface ITodoService {
	getTodoById: (todoId: string) => Promise<Todo>;
	getAllTodos: () => Promise<Todo[]>;
	addTodo: (data: CreateTodoInput) => Promise<Todo>;
	updateTodo: (todoId: string, data: PatchTodoInput) => Promise<Todo>;
	deleteTodo: (todoId: string) => Promise<Todo>;
}
