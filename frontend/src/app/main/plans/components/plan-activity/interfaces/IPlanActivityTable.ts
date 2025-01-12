import { IPlanActivity } from './IPlanActivity';

export interface IPlanActivityTable {
  userWorkload: number;
  planActivities: IPlanActivity[];
}
