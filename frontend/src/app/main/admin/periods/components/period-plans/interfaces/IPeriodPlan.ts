import { EPlanSituation } from '../../../../../plans/enums/EPlanSituation';

export interface IPeriodPlan {
  userName: string;
  userWorkload: number;
  planId?: string;
  planSituation: EPlanSituation;
}
