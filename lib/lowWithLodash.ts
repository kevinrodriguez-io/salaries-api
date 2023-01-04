import _ from 'lodash';
import { JSONFile, Low } from 'lowdb';
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

// Extend Low class with a new `chain` field
export class LowWithLodash<T> extends Low<T> {
  chain: _.ExpChain<this['data']> = _.chain(this).get('data');
}

export const getAdapter = () => {
  const adapter = new JSONFile<Data>('./db.json');
  return adapter;
};

export const getDB = () => new LowWithLodash<Data>(getAdapter());
