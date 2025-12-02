import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { ValidationError } from '../utils/errors';

export function validate(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        throw new ValidationError(messages);
      }
      next(error);
    }
  };
}

// Common validation schemas
export const schemas = {
  auth: {
    register: z.object({
      body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        name: z.string().min(1, 'Name is required'),
      }),
    }),
    login: z.object({
      body: z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().min(1, 'Password is required'),
      }),
    }),
  },
  board: {
    create: z.object({
      body: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        color: z.string().optional(),
        category: z.string().optional(),
        isPublic: z.boolean().optional(),
      }),
    }),
    update: z.object({
      body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        color: z.string().optional(),
        category: z.string().optional(),
      }),
      params: z.object({
        id: z.string().min(1),
      }),
    }),
  },
  column: {
    create: z.object({
      body: z.object({
        title: z.string().min(1, 'Title is required'),
        position: z.number().optional(),
      }),
      params: z.object({
        boardId: z.string().min(1),
      }),
    }),
    update: z.object({
      body: z.object({
        title: z.string().min(1).optional(),
        position: z.number().optional(),
      }),
      params: z.object({
        id: z.string().min(1),
      }),
    }),
  },
  card: {
    create: z.object({
      body: z.object({
        title: z.string().min(1, 'Title is required'),
        description: z.string().optional(),
        image: z.string().url().optional().or(z.literal('')),
        position: z.number().optional(),
      }),
      params: z.object({
        columnId: z.string().min(1),
      }),
    }),
    update: z.object({
      body: z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().url().optional().or(z.literal('')),
      }),
      params: z.object({
        id: z.string().min(1),
      }),
    }),
  },
  comment: {
    create: z.object({
      body: z.object({
        content: z.string().min(1, 'Content is required'),
      }),
      params: z.object({
        cardId: z.string().min(1),
      }),
    }),
    update: z.object({
      body: z.object({
        content: z.string().min(1, 'Content is required'),
      }),
      params: z.object({
        id: z.string().min(1),
      }),
    }),
  },
};

