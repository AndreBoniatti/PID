import { IPlanActivity } from './IPlanActivity';

export interface IPlanActivityTable {
  updating?: IPlanActivity;
  alreadySaved?: IPlanActivity[];
}
