import { IActivityType } from './IActivityType';

export interface IPlanActivity {
  id?: string;
  description: string;
  workload: number;
  workloadAllocation: string[];
  activityType?: IActivityType;
}
