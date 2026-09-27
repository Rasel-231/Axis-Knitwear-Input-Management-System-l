// Kept in sync with backend's prisma/schema.prisma enums and
// src/interfaces/common.ts. If the backend schema changes, update here too.

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  INPUT_SUPERVISOR = 'INPUT_SUPERVISOR',
  CUTTING_SUPERVISOR = 'CUTTING_SUPERVISOR',
  RIB_SUPERVISOR = 'RIB_SUPERVISOR',
  CUTTING_INPUTMAN = 'CUTTING_INPUTMAN',
  SEWING_INPUTMAN = 'SEWING_INPUTMAN',
  INSPECTION_ENGINEER = 'INSPECTION_ENGINEER',
  PRINT_SUPERVISOR = 'PRINT_SUPERVISOR',
}

export enum InputType {
  CUTTING = 'CUTTING',
  SEWING = 'SEWING',
  RIB = 'RIB',
}

export enum InputStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum ProductionStage {
  RIB = 'RIB',
  CUTTING = 'CUTTING',
  SEWING = 'SEWING',
  INSPECTION = 'INSPECTION',
}

export enum PrintStatus {
  SENT = 'SENT',
  PARTIAL = 'PARTIAL',
  RECEIVED = 'RECEIVED',
}

export type IUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};

export type IInput = {
  id: string;
  type: InputType;
  quantity: number;
  remarks?: string | null;
  status: InputStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type ICreateInputPayload = {
  type: InputType;
  quantity: number;
  remarks?: string;
};

export type IWipSummaryItem = {
  type: InputType;
  status: InputStatus;
  totalQuantity: number;
  count: number;
};

export type IDemandItem = {
  type: InputType;
  targetQuantity: number;
  achievedQuantity: number;
};

export type IDashboardSummary = {
  wip: IWipSummaryItem[];
  demand: IDemandItem[];
};

export type IChatResponse = {
  answer: string;
  contextUsed: { source: string; content: string }[];
};

/**
 * One production input row as the shop floor reports it: Rib / Cutting /
 * Sewing / Inspection all share the same identity fields (buyer, style,
 * cutting, color, lot-batch) so a record can be followed across stages.
 */
export type IProductionInput = {
  id: string;
  buyer: string;
  style: string;
  cutting: string;
  color: string;
  lotBatch: string;
  bundleNo: string;
  quantity?: number;
  status: InputStatus;
  stage: ProductionStage;
  line: string;
  inputDate: string;
  remarks?: string;
  enteredBy: string;
  enteredByRole: Role;
  createdAt: string;
  updatedAt: string;
};

export type IProductionInputDraft = Omit<IProductionInput, 'id' | 'createdAt' | 'updatedAt'>;

export type IPrintRecord = {
  id: string;
  buyer: string;
  style: string;
  cutting: string;
  color: string;
  lotBatch: string;
  printType: string;
  line: string;
  sentQuantity: number;
  sentAt: string;
  sentBy: string;
  receivedQuantity?: number;
  receivedAt?: string;
  receivedBy?: string;
  remarks?: string;
  status: PrintStatus;
};

export type IPrintDraft = {
  buyer: string;
  style: string;
  cutting: string;
  color: string;
  lotBatch: string;
  printType: string;
  line: string;
  sentQuantity: number;
  remarks?: string;
};

export type IPrintReceiveDraft = {
  receivedQuantity: number;
  receivedBy: string;
  remarks?: string;
};

export type ILineOutput = {
  date: string;
  quantity: number;
};

export type IProductionFilters = {
  search: string;
  buyer: string;
  style: string;
  cutting: string;
  color: string;
  lotBatch: string;
  status: string;
  stage: string;
  line: string;
};

export const EMPTY_FILTERS: IProductionFilters = {
  search: '',
  buyer: '',
  style: '',
  cutting: '',
  color: '',
  lotBatch: '',
  status: '',
  stage: '',
  line: '',
};

// Mirrors backend's sendResponse.ts envelope exactly.
export type IMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage?: number;
};

export type IApiResponse<T> = {
  success: boolean;
  message: string | null;
  meta?: IMeta | null;
  data: T | null;
};

export type IApiErrorResponse = {
  success: false;
  message: string;
  errorMessages: { path: string | number; message: string }[];
};
