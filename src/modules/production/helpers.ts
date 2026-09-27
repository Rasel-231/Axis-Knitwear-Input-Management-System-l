import { InputStatus, PrintStatus, ProductionStage } from '../../types';

export const STATUS_LABELS: Record<InputStatus, string> = {
  PENDING: 'Pending',
  ACCEPTED: 'Okay',
  REJECTED: 'Rejected',
};

export type StatusTone = 'pending' | 'success' | 'danger' | 'default';

export const STATUS_TONES: Record<InputStatus, StatusTone> = {
  PENDING: 'pending',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

export const STAGE_LABELS: Record<ProductionStage, string> = {
  [ProductionStage.RIB]: 'Rib',
  [ProductionStage.CUTTING]: 'Cutting',
  [ProductionStage.SEWING]: 'Sewing',
  [ProductionStage.INSPECTION]: 'Inspection',
};

export const PRINT_STATUS_LABELS: Record<PrintStatus, string> = {
  [PrintStatus.SENT]: 'Sent',
  [PrintStatus.PARTIAL]: 'Partially received',
  [PrintStatus.RECEIVED]: 'Received',
};

export const PRINT_STATUS_TONES: Record<PrintStatus, StatusTone> = {
  [PrintStatus.SENT]: 'pending',
  [PrintStatus.PARTIAL]: 'danger',
  [PrintStatus.RECEIVED]: 'success',
};

export const formatQty = (value?: number) =>
  value === undefined || value === null ? '—' : value.toLocaleString('en-US');

export const formatDay = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '—';

export const formatDayTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
