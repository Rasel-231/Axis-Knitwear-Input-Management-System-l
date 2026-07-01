// Kept in sync with backend's prisma/schema.prisma enums and
// src/interfaces/common.ts. If the backend schema changes, update here too.

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
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
