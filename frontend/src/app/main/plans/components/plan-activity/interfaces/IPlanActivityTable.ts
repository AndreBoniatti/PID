import { IPlanActivity } from './IPlanActivity';

export interface IPlanActivityTable {
  userWorkload: number;
  updating?: IPlanActivity;
  alreadySaved?: IPlanActivity[];
}
