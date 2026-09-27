import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../core/store/store';
import { IProductionFilters, IProductionInput, InputStatus, ProductionStage } from '../../types';

const selectInputs = (state: RootState) => state.production.inputs;
const selectPrints = (state: RootState) => state.production.prints;

const matchesText = (haystack: string, needle: string) =>
  !needle || haystack.toLowerCase().includes(needle.trim().toLowerCase());

export const selectFilteredInputs = createSelector(
  [selectInputs, (_state: RootState, filters: IProductionFilters) => filters],
  (inputs, filters) =>
    inputs.filter((row) => {
      if (filters.stage && row.stage !== (filters.stage as ProductionStage)) return false;
      if (filters.status && row.status !== (filters.status as InputStatus)) return false;
      if (filters.line && row.line !== filters.line) return false;
      if (filters.buyer && row.buyer !== filters.buyer) return false;
      if (filters.style && row.style !== filters.style) return false;
      if (filters.cutting && row.cutting !== filters.cutting) return false;
      if (filters.color && row.color !== filters.color) return false;
      if (filters.lotBatch && !matchesText(row.lotBatch, filters.lotBatch)) return false;

      const search = filters.search.trim().toLowerCase();
      if (!search) return true;

      return [row.buyer, row.style, row.cutting, row.color, row.lotBatch, row.bundleNo, row.line].some((value) =>
        matchesText(value, search),
      );
    }),
);

export const selectWipSummary = createSelector([selectInputs], (inputs) => {
  const stages = [ProductionStage.RIB, ProductionStage.CUTTING, ProductionStage.SEWING, ProductionStage.INSPECTION];
  const statuses = [InputStatus.PENDING, InputStatus.ACCEPTED, InputStatus.REJECTED];

  return stages.flatMap((stage) =>
    statuses.map((status) => {
      const rows = inputs.filter((row) => row.stage === stage && row.status === status);
      return {
        stage,
        status,
        count: rows.length,
        quantity: rows.reduce((sum, row) => sum + (row.quantity ?? 0), 0),
      };
    }),
  );
});

export const selectStageTotals = createSelector([selectInputs], (inputs) => {
  const totals = new Map<ProductionStage, number>();
  inputs.forEach((row) => {
    if (row.status === InputStatus.REJECTED) return;
    totals.set(row.stage, (totals.get(row.stage) ?? 0) + (row.quantity ?? 0));
  });
  return Array.from(totals.entries()).map(([stage, quantity]) => ({ stage, quantity }));
});

export const selectUpcomingInputs = createSelector([selectInputs], (inputs) =>
  inputs.filter((row) => row.status === InputStatus.PENDING).slice(0, 12),
);

export const selectReadyToShip = createSelector([selectInputs], (inputs) =>
  inputs.filter((row) => row.stage === ProductionStage.INSPECTION && row.status === InputStatus.ACCEPTED),
);

export const selectPrints = createSelector([selectPrints], (prints) => prints);

export const selectPendingPrints = createSelector([selectPrints], (prints) =>
  prints.filter((row) => row.status !== 'RECEIVED'),
);

export const selectReceivedPrints = createSelector([selectPrints], (prints) =>
  prints.filter((row) => row.status === 'RECEIVED' || row.status === 'PARTIAL'),
);

export const selectPrintSummary = createSelector([selectPrints], (prints) => {
  const sent = prints.reduce((sum, row) => sum + row.sentQuantity, 0);
  const received = prints.reduce((sum, row) => sum + (row.receivedQuantity ?? 0), 0);
  return {
    sent,
    received,
    pending: sent - received,
    awaiting: prints.filter((row) => row.status === 'SENT').length,
  };
});

export const selectReadyToPrintRows = (state: RootState): IProductionInput[] =>
  state.production.inputs.filter((row) => row.stage === ProductionStage.INSPECTION);
