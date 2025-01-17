export interface IAggregatedPlans {
  slot: string;
  activities: IAggregatedPlanActivities[];
}

export interface IAggregatedPlanActivities {
  userName: string;
  activityDescription: string;
  activityTypeId: string;
}
