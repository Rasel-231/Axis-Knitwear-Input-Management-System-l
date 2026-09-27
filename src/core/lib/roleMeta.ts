import { ProductionStage, Role } from '../../types';

export type RoleMeta = {
  label: string;
  short: string;
  description: string;
  stage?: ProductionStage;
  /** Can this role move a record from Pending to Okay (work finished)? */
  canMarkOkay: boolean;
  /** Can this role open a new production input at all? */
  canCreateInput: boolean;
  canAccessPrint: boolean;
  canApprove: boolean;
};

const READ_ONLY = {
  canMarkOkay: false,
  canCreateInput: false,
  canAccessPrint: false,
  canApprove: false,
};

export const ROLE_META: Record<Role, RoleMeta> = {
  [Role.ADMIN]: {
    label: 'Administrator',
    short: 'Admin',
    description: 'Full visibility and control over every stage, line and record.',
    canMarkOkay: true,
    canCreateInput: true,
    canAccessPrint: true,
    canApprove: true,
  },
  [Role.INPUT_SUPERVISOR]: {
    label: 'Input Super Visor',
    short: 'Input Super Visor',
    description: 'Monitors the incoming fabric flow and approves released cutting input.',
    canMarkOkay: false,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: true,
  },
  [Role.CUTTING_SUPERVISOR]: {
    label: 'Cutting Super Visor',
    short: 'Cutting Super Visor',
    description: 'Releases cutting with bundle numbers and marks cutting complete.',
    stage: ProductionStage.CUTTING,
    canMarkOkay: true,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: false,
  },
  [Role.RIB_SUPERVISOR]: {
    label: 'Rib Super Visor',
    short: 'Rib Super Visor',
    description: 'Enters collar and bottom input right after they are cut.',
    stage: ProductionStage.RIB,
    canMarkOkay: true,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: false,
  },
  [Role.CUTTING_INPUTMAN]: {
    label: 'Cutting Input Man',
    short: 'Cutting Input Man',
    description: 'Records cutting input on the line as cutting is done.',
    stage: ProductionStage.CUTTING,
    canMarkOkay: false,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: false,
  },
  [Role.SEWING_INPUTMAN]: {
    label: 'Sewing Input Man',
    short: 'Sewing Input Man',
    description: 'Enters sewing output against the released cutting bundle.',
    stage: ProductionStage.SEWING,
    canMarkOkay: true,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: false,
  },
  [Role.INSPECTION_ENGINEER]: {
    label: 'Inspection Engineer',
    short: 'IE',
    description: 'Inspects finished bodies and raises them for printing.',
    stage: ProductionStage.INSPECTION,
    canMarkOkay: true,
    canCreateInput: true,
    canAccessPrint: false,
    canApprove: false,
  },
  [Role.PRINT_SUPERVISOR]: {
    label: 'Print Super Visor',
    short: 'Print Super Visor',
    description: 'Sends printing to the vendor, receives it back and reviews the day.',
    canMarkOkay: false,
    canCreateInput: false,
    canAccessPrint: true,
    canApprove: false,
  },
  [Role.USER]: {
    label: 'User',
    short: 'User',
    description: 'Views upcoming input, WIP dashboard and filters.',
    ...READ_ONLY,
  },
};

export const ALL_ROLES = Object.values(Role);

export const isRole = (value: string): value is Role => ALL_ROLES.includes(value as Role);

export const roleLabel = (role: Role) => ROLE_META[role]?.label ?? role;

export const ROLE_PATH: Record<Role, string> = ALL_ROLES.reduce(
  (acc, role) => ({ ...acc, [role]: `/${role.toLowerCase()}` }),
  {} as Record<Role, string>,
);

export const roleFromPath = (segment: string): Role | undefined =>
  ALL_ROLES.find((role) => role.toLowerCase() === segment.toLowerCase());
