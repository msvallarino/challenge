import * as z from 'zod';

export const todoModel = z
	.object({
		todoId: z.string().uuid(), // SET in service
		title: z.string().trim(),
		description: z.string().trim(),
		dueDate: z.string().date(),
		createdAt: z.string().date(), // SET in service
		updatedAt: z.string().date(), // SET in service
	})
	.describe('Todo model');

export type Todo = z.infer<typeof todoModel>;
