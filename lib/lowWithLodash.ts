import _ from 'lodash';
import low from 'lowdb';
import File from 'lowdb/adapters/FileSync';
import { z } from 'zod';

export const salarySchema = z.object({
  name: z.string(),
  salary: z.number(),
  currency: z.string(),
  department: z.string(),
  sub_department: z.string(),
  on_contract: z.optional(z.boolean()),
});

export type Salary = z.infer<typeof salarySchema>;

type Data = {
  salaries: Salary[];
};

export const getAdapter = () => {
  const adapter = new File<Data>('db.json');
  return adapter;
};

export const getDB = () => {
  const adapter = getAdapter();
  const db = low(adapter);
  return db;
};
