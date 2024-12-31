export interface ICreatePlanActivity {
  planId: string | null;
  activityTypeId: string;
  description: string;
  workloadAllocation: string[];
}

export interface ICreatePlanActivityResponse {
  planId: string;
}
