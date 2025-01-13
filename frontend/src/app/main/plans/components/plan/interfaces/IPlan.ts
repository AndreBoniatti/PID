import { IUser } from '../../../../../auth/interfaces/IUser';
import { IPlanActivity } from '../../plan-activity/interfaces/IPlanActivity';

export interface IPlan {
  period: string;
  user?: IUser;
  activities?: IPlanActivity[];
}
