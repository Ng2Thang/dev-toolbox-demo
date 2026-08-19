import type { CreateToolRun } from './run.schema';

export type ToolRun = CreateToolRun & {
  id: string;
  created_at: string;
};
