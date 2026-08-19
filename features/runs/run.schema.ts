import { z } from 'zod';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const jsonValue: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValue),
    z.record(z.string(), jsonValue),
  ]),
);

export const createToolRunSchema = z
  .object({
    tool: z.string().trim().min(1).max(100),
    input: z.string().max(20_000),
    output: jsonValue,
  })
  .strict();

export type CreateToolRun = z.infer<typeof createToolRunSchema>;
