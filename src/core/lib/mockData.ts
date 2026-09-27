import {
  ILineOutput,
  IPrintRecord,
  IProductionInput,
  InputStatus,
  PrintStatus,
  ProductionStage,
  Role,
} from '../../types';

export const BUYERS = ['H&M', 'Zara', 'Walmart', 'Primark', 'Uniqlo', 'Mango', 'GAP', 'PVH', 'Lee', 'Next'];

export const CUTTINGS = [
  'Single Jersey',
  'Interlock',
  'Pique',
  'Rib 1x1',
  'Rib 2x2',
  'Fleece',
  'Terry',
  'Canvas',
  'Denim',
  'Lycra',
];

export const COLORS = ['White', 'Black', 'Navy', 'Grey', 'Red', 'Green', 'Beige', 'Maroon', 'Sky', 'Off White'];

export const PRINT_TYPES = ['Main Label', 'Care Label', 'Size Label', 'Hang Tag', 'Barcode Sticker'];

export const LINE_COUNT = 36;

export const PRODUCTION_LINES = Array.from({ length: LINE_COUNT }, (_, i) => `Line ${String(i + 1).padStart(2, '0')}`);

export const OPERATORS = [
  'R. Chowdhury',
  'S. Akter',
  'M. Hossain',
  'T. Islam',
  'N. Rahman',
  'A. Sultana',
  'J. Uddin',
  'F. Kabir',
];

export const STYLES_BY_BUYER: Record<string, string[]> = BUYERS.reduce(
  (acc, buyer, bi) => ({
    ...acc,
    [buyer]: [1, 2, 3].map((n) => `${buyer.slice(0, 2).toUpperCase()}-${2400 + bi * 13 + n}`),
  }),
  {} as Record<string, string[]>,
);

const startOfToday = () => {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
};

const ANCHOR = startOfToday();

const isoDaysAgo = (days: number) => {
  const d = new Date(ANCHOR);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
};

const dayLabel = (days: number) =>
  new Date(ANCHOR.getTime() - days * 86400000).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  });

// Deterministic pseudo-random so the server-rendered HTML and the client
// hydration always produce the exact same mock rows.
const pick = <T,>(list: T[], seed: number): T => list[seed % list.length];

const buildMockInputs = (): IProductionInput[] => {
  const rows: IProductionInput[] = [];
  const stages = [ProductionStage.RIB, ProductionStage.CUTTING, ProductionStage.SEWING, ProductionStage.INSPECTION];
  const statusCycle = [InputStatus.PENDING, InputStatus.ACCEPTED, InputStatus.PENDING, InputStatus.ACCEPTED, InputStatus.REJECTED];

  for (let i = 0; i < 96; i++) {
    const buyer = pick(BUYERS, i * 5);
    const style = pick(STYLES_BY_BUYER[buyer], i);
    const stage = pick(stages, i * 3);
    const status = pick(statusCycle, i);
    const dayOffset = i % 12;
    const createdAt = isoDaysAgo(dayOffset);

    rows.push({
      id: `PI-${1000 + i}`,
      buyer,
      style,
      cutting: pick(CUTTINGS, i * 7),
      color: pick(COLORS, i * 11),
      lotBatch: `LOT-${String(1200 + i * 3).padStart(4, '0')}`,
      bundleNo: stage === ProductionStage.RIB ? '' : `BDL-${String(500 + i).padStart(4, '0')}`,
      quantity: 120 + ((i * 37) % 880),
      status,
      stage,
      line: pick(PRODUCTION_LINES, i * 13),
      inputDate: createdAt,
      remarks: i % 7 === 0 ? 'Spotting on second panel' : undefined,
      enteredBy: pick(OPERATORS, i * 5),
      enteredByRole:
        stage === ProductionStage.RIB
          ? Role.RIB_SUPERVISOR
          : stage === ProductionStage.CUTTING
            ? Role.CUTTING_INPUTMAN
            : stage === ProductionStage.SEWING
              ? Role.SEWING_INPUTMAN
              : Role.INSPECTION_ENGINEER,
      createdAt,
      updatedAt: createdAt,
    });
  }

  return rows.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};

const buildMockPrints = (): IPrintRecord[] => {
  const rows: IPrintRecord[] = [];

  for (let i = 0; i < 34; i++) {
    const buyer = pick(BUYERS, i * 3);
    const sentQuantity = 200 + ((i * 53) % 900);
    const dayOffset = i % 8;
    const sentAt = isoDaysAgo(dayOffset);
    const isReceived = i % 3 !== 0;
    const receivedQuantity = isReceived ? sentQuantity - ((i * 17) % 3 === 0 ? 20 + i : 0) : undefined;

    rows.push({
      id: `PR-${2000 + i}`,
      buyer,
      style: pick(STYLES_BY_BUYER[buyer], i * 2),
      cutting: pick(CUTTINGS, i * 9),
      color: pick(COLORS, i * 4),
      lotBatch: `LOT-${String(1200 + i * 3).padStart(4, '0')}`,
      printType: pick(PRINT_TYPES, i * 3),
      line: pick(PRODUCTION_LINES, i * 11),
      sentQuantity,
      sentAt,
      sentBy: pick(OPERATORS, i),
      receivedQuantity,
      receivedAt: isReceived ? isoDaysAgo(Math.max(0, dayOffset - 2)) : undefined,
      receivedBy: isReceived ? pick(OPERATORS, i * 2) : undefined,
      remarks: i % 6 === 0 ? 'Vendor delayed by one day' : undefined,
      status: isReceived
        ? receivedQuantity === sentQuantity
          ? PrintStatus.RECEIVED
          : PrintStatus.PARTIAL
        : PrintStatus.SENT,
    });
  }

  return rows.sort((a, b) => (a.sentAt < b.sentAt ? 1 : -1));
};

export const MOCK_INPUTS = buildMockInputs();
export const MOCK_PRINTS = buildMockPrints();

export const CHART_DAYS = 12;

/** Deterministic 12-day output per production line, used by the 36 chart cards. */
export const buildLineOutputs = (line: string, inputs: IProductionInput[]): ILineOutput[] => {
  const lineIndex = PRODUCTION_LINES.indexOf(line);
  const lineTotal = inputs
    .filter((row) => row.line === line && row.status !== InputStatus.REJECTED)
    .reduce((sum, row) => sum + (row.quantity ?? 0), 0);

  return Array.from({ length: CHART_DAYS }, (_, i) => {
    const daysAgo = CHART_DAYS - 1 - i;
    const wave = 62 + ((lineIndex * 29 + i * 17) % 38);
    const quantity = Math.max(0, Math.round((lineTotal / CHART_DAYS) * (wave / 100)));
    return { date: dayLabel(daysAgo), quantity };
  });
};
