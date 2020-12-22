export interface Tour {
  id: number;
  reference: string;
  guideId: number;
  teamIds: number[];
  categoryId: number;
  categoryIds: number[];
  tourId: number;
  deadlineId: number;
  preliminaryId: number | null;
  info: string;
  youthOnTour: boolean;
  relaxed: boolean;
  ladiesOnly: boolean;
  qualificationIds: number[];
  preconditions: string;
  equipmentIds: number[];
  miscEquipment: string;
  equipmentService: boolean;
  skillId: number;
  fitnessId: number;
  admission: number;
  advances: number;
  advancesInfo: string;
  extraCharges: number;
  extraChargesInfo: string;
  minQuantity: number;
  maxQuantity: number;
  curQuantity?: number;
  deprecated: boolean;
  stateId: number;
  comment: string;
  message: string;
}
