'use client';

import { BUYERS, COLORS, CUTTINGS, PRODUCTION_LINES, STYLES_BY_BUYER } from '../../../core/lib/mockData';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { InputStatus, ProductionStage, Role } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { ROLE_META } from '../../../core/lib/roleMeta';
import { EMPTY_FILTERS, IProductionFilters } from '../../../types';
import { STAGE_LABELS, STATUS_LABELS } from '../helpers';

type Props = {
  filters: IProductionFilters;
  onChange: (next: IProductionFilters) => void;
  resultCount: number;
};

const controlClass =
  'h-9 w-full rounded-lg border border-slate-300 bg-white px-2.5 text-xs text-slate-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10';

export function ProductionFilters({ filters, onChange, resultCount }: Props) {
  const { user } = useAuth();
  const role = (user?.role ?? Role.USER) as Role;
  const meta = ROLE_META[role];

  const set = (patch: Partial<IProductionFilters>) => onChange({ ...filters, ...patch });
  const styleOptions = filters.buyer ? STYLES_BY_BUYER[filters.buyer] ?? [] : [];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Is the input ready? — filter by style, cutting, color or buyer
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{resultCount} matching</span>
          <Button size="sm" variant="ghost" onClick={() => onChange({ ...EMPTY_FILTERS })}>
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Input
          value={filters.search}
          onChange={(e) => set({ search: e.target.value })}
          placeholder="Search anything…"
          className={controlClass}
        />
        <Select
          value={filters.buyer}
          onChange={(e) => set({ buyer: e.target.value, style: '' })}
          className={controlClass}
        >
          <option value="">All buyers</option>
          {BUYERS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select
          value={filters.style}
          onChange={(e) => set({ style: e.target.value })}
          disabled={!filters.buyer}
          className={controlClass}
        >
          <option value="">All styles</option>
          {styleOptions.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={filters.cutting} onChange={(e) => set({ cutting: e.target.value })} className={controlClass}>
          <option value="">All cuttings</option>
          {CUTTINGS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={filters.color} onChange={(e) => set({ color: e.target.value })} className={controlClass}>
          <option value="">All colors</option>
          {COLORS.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={filters.status} onChange={(e) => set({ status: e.target.value })} className={controlClass}>
          <option value="">Any status</option>
          {Object.values(InputStatus).map((item) => (
            <option key={item} value={item}>
              {STATUS_LABELS[item]}
            </option>
          ))}
        </Select>
        <Select value={filters.stage} onChange={(e) => set({ stage: e.target.value })} className={controlClass}>
          <option value="">All stages</option>
          {Object.values(ProductionStage).map((item) => (
            <option key={item} value={item}>
              {STAGE_LABELS[item]}
            </option>
          ))}
        </Select>
        <Select value={filters.line} onChange={(e) => set({ line: e.target.value })} className={controlClass}>
          <option value="">All 36 lines</option>
          {PRODUCTION_LINES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Input
          value={filters.lotBatch}
          onChange={(e) => set({ lotBatch: e.target.value })}
          placeholder="Lot / batch"
          className={controlClass}
        />
      </div>

      {meta.canApprove && (
        <p className="mt-3 text-xs text-slate-400">
          As {meta.label} you can accept or reject any pending record directly from the list.
        </p>
      )}
    </div>
  );
}
