import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MOCK_INPUTS, MOCK_PRINTS } from '../../lib/mockData';
import {
  IPrintDraft,
  IPrintRecord,
  IProductionInput,
  IProductionInputDraft,
  InputStatus,
  PrintStatus,
} from '../../../types';

/**
 * Mock-backed store for the production flow while the backend endpoints are
 * still being written. Every screen reads from here, so submitting any form
 * immediately reflects in the list, the WIP dashboard and the 36 line charts.
 *
 * Swap point for later: replace these reducers with RTK Query mutations —
 * the selectors and components stay untouched.
 */
type ProductionState = {
  inputs: IProductionInput[];
  prints: IPrintRecord[];
};

const initialState: ProductionState = {
  inputs: MOCK_INPUTS,
  prints: MOCK_PRINTS,
};

const now = () => new Date().toISOString();

let sequenceCounter = 1;
const nextSequence = () => (sequenceCounter += 1);

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    addInput: {
      reducer: (state, action: PayloadAction<IProductionInput>) => {
        state.inputs.unshift(action.payload);
      },
      prepare: (draft: IProductionInputDraft) => {
        const sequence = nextSequence();
        return {
          payload: {
            ...draft,
            id: `PI-${1000 + sequence}`,
            createdAt: now(),
            updatedAt: now(),
          },
        };
      },
    },
    setInputStatus: (state, action: PayloadAction<{ id: string; status: InputStatus }>) => {
      const row = state.inputs.find((item) => item.id === action.payload.id);
      if (!row) return;
      row.status = action.payload.status;
      row.updatedAt = now();
    },
    updateInput: (state, action: PayloadAction<{ id: string; changes: Partial<IProductionInput> }>) => {
      const row = state.inputs.find((item) => item.id === action.payload.id);
      if (!row) return;
      Object.assign(row, action.payload.changes, { updatedAt: now() });
    },
    deleteInput: (state, action: PayloadAction<string>) => {
      state.inputs = state.inputs.filter((item) => item.id !== action.payload);
    },
    sendPrinting: {
      reducer: (state, action: PayloadAction<IPrintRecord>) => {
        state.prints.unshift(action.payload);
      },
      prepare: (draft: IPrintDraft, sentBy: string) => {
        const sequence = nextSequence();
        return {
          payload: {
            ...draft,
            id: `PR-${2000 + sequence}`,
            sentAt: now(),
            sentBy,
            status: PrintStatus.SENT,
          },
        };
      },
    },
    receivePrinting: (
      state,
      action: PayloadAction<{ id: string; receivedQuantity: number; receivedBy: string; remarks?: string }>,
    ) => {
      const row = state.prints.find((item) => item.id === action.payload.id);
      if (!row) return;
      row.receivedQuantity = action.payload.receivedQuantity;
      row.receivedBy = action.payload.receivedBy;
      row.receivedAt = now();
      if (action.payload.remarks) row.remarks = action.payload.remarks;
      row.status =
        action.payload.receivedQuantity >= row.sentQuantity ? PrintStatus.RECEIVED : PrintStatus.PARTIAL;
    },
  },
});

export const {
  addInput,
  setInputStatus,
  updateInput,
  deleteInput,
  sendPrinting,
  receivePrinting,
} = productionSlice.actions;

export default productionSlice.reducer;
