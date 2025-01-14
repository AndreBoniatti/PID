import { EPlanSituation } from '../enums/EPlanSituation';

export interface IPlans {
  id?: string;
  period: string;
  situation: EPlanSituation;
}
