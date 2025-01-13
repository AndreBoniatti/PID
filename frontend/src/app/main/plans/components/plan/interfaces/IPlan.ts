import { IUser } from '../../../../../auth/interfaces/IUser';
import { EPlanSituation } from '../../../enums/EPlanSituation';
import { IPlanActivity } from '../../plan-activity/interfaces/IPlanActivity';

export interface IPlan {
  situation: EPlanSituation;
  observation?: string;
  period: string;
  user?: IUser;
  activities?: IPlanActivity[];
}
