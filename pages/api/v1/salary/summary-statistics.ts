import type { NextApiHandler } from 'next';
import Cors from 'cors';

import { runMiddleware } from '../../../../lib/runMiddleware';
import { authenticate } from '../auth';
import { getDB, Salary } from '../../../../lib/lowWithLodash';

const cors = Cors({
  methods: ['POST', 'GET', 'HEAD'],
});

type SummaryStatistics = {
  min: number;
  max: number;
  mean: number;
};

type SummaryStatisticsResponse =
  | Record<string, Record<string, SummaryStatistics>> // department -> subdepartment -> summary statistics
  | Record<string, SummaryStatistics> // department -> summary statistics
  | SummaryStatistics // all departments
  | { error?: string };

const getSummaryStatistics = (items: Salary[]) => {
  const sortedItems = items.slice().sort((a, b) => a.salary - b.salary);
  const min = sortedItems[0].salary;
  const max = sortedItems[sortedItems.length - 1].salary;
  const mean =
    sortedItems.map((e) => e.salary).reduce((a, b) => a + b) /
    sortedItems.length;
  return { min, max, mean };
};

const handler: NextApiHandler<SummaryStatisticsResponse> = async (req, res) => {
  await runMiddleware(req, res, cors);
  const authResult = await authenticate(req);
  if (!authResult) {
    res.status(401).json({ error: 'UNAUTHORIZED' });
    return;
  }

  const allDepartments = req.query.department as string | undefined;
  const allSubdepartments = req.query.subDepartment as string | undefined;
  const onContract = req.query.onContract as boolean | undefined;

  const db = getDB();

  // TODO: Cascade filters so they all add up.
  if (onContract) {
    const onContractSalaries = db.data!.salaries.filter((e) => !!e.on_contract);
    const { min, max, mean } = getSummaryStatistics(onContractSalaries);
    res.status(200).json({ min, max, mean });
    return;
  }

  if (!allDepartments) {
    const allSalaries = db.data!.salaries;
    const { min, max, mean } = getSummaryStatistics(allSalaries);
    res.status(200).json({ min, max, mean });
    return;
  }

  if (!allSubdepartments) {
    const groupedSalaries = db.chain
      .get('salaries')
      .groupBy((i) => i.department)
      .value();
    const compoundResponse: Record<string, SummaryStatistics> = {};
    for (const [department, salaries] of Object.entries(groupedSalaries)) {
      const { min, max, mean } = getSummaryStatistics(salaries);
      compoundResponse[department] = { min, max, mean };
    }
    res.status(200).json(compoundResponse);
  }

  const allDepartmentsInDB = db.data!.salaries.map((i) => i.department);
  const compoundResponse: Record<
    string,
    Record<string, SummaryStatistics>
  > = {};
  for (const department of allDepartmentsInDB) {
    const allSubdepartmentsForThisDepartment = db.chain
      .get('salaries')
      .filter((i) => i.department === department)
      .groupBy((i) => i.sub_department);
    for (const [subdepartment, salaries] of Object.entries(
      allSubdepartmentsForThisDepartment,
    )) {
      const { min, max, mean } = getSummaryStatistics(salaries);
      compoundResponse[department] = {
        ...compoundResponse[department],
        [subdepartment]: { min, max, mean },
      };
    }
  }

  res.status(200).json(compoundResponse);
};

export default handler;
