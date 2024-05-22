import { type z } from 'zod';
import { todoModel } from '@models/todo.model';

export const createTodoSchema = todoModel
	.pick({
		title: true,
		description: true,
		dueDate: true,
	})
	.describe('Create Todo input');
export type CreateTodoInput = z.infer<typeof createTodoSchema>;

export const patchTodoSchema = createTodoSchema.partial().describe('Patch Todo input');
export type PatchTodoInput = z.infer<typeof patchTodoSchema>;
