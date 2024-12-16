export enum EPlanSituation {
  PENDING = 0,
  SENT = 1,
  APPROVED = 2,
}

export function getPlanSituationDescription(situation: number): string {
  let description = '';

  switch (situation) {
    case EPlanSituation.PENDING:
      description = 'Pendente';
      break;

    case EPlanSituation.SENT:
      description = 'Enviado';
      break;

    case EPlanSituation.APPROVED:
      description = 'Homologado';
      break;

    default:
      break;
  }

  return description;
}
