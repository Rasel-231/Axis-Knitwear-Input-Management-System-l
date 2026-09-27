'use client';

import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { IProductionInput, InputStatus, Role } from '../../../types';
import { useAuth } from '../../../hooks/useAuth';
import { ROLE_META } from '../../../core/lib/roleMeta';
import { STAGE_LABELS, STATUS_LABELS, STATUS_TONES, formatDay, formatQty } from '../helpers';

type Props = {
  rows: IProductionInput[];
  onSetStatus: (id: string, status: InputStatus) => void;
};

export function ProductionInputList({ rows, onSetStatus }: Props) {
  const { user } = useAuth();
  const meta = ROLE_META[(user?.role ?? Role.USER) as Role];

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-700">No input matches these filters</p>
        <p className="mt-1 text-sm text-slate-500">Try clearing a filter or search a different style or lot.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Buyer</th>
              <th className="px-4 py-3 font-medium">Style</th>
              <th className="px-4 py-3 font-medium">Cutting</th>
              <th className="px-4 py-3 font-medium">Color</th>
              <th className="px-4 py-3 font-medium">Lot / Batch</th>
              <th className="px-4 py-3 font-medium">Bundle No</th>
              <th className="px-4 py-3 text-right font-medium">Qty</th>
              <th className="px-4 py-3 font-medium">Stage</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Line</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-900">{row.buyer}</span>
                  <span className="ml-2 text-xs text-slate-400">{row.id}</span>
                </td>
                <td className="px-4 py-3 text-slate-700">{row.style}</td>
                <td className="px-4 py-3 text-slate-700">{row.cutting}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 text-slate-700">
                    <span className="h-3 w-3 rounded-full border border-slate-300" style={{ background: swatch(row.color) }} />
                    {row.color}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.lotBatch}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-600">
                  {row.bundleNo || <span className="text-slate-300">—</span>}
                </td>
                <td className="px-4 py-3 text-right font-medium text-slate-900">{formatQty(row.quantity)}</td>
                <td className="px-4 py-3">
                  <Badge variant="default">{STAGE_LABELS[row.stage]}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_TONES[row.status]}>{STATUS_LABELS[row.status]}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">{row.line}</td>
                <td className="px-4 py-3 text-slate-500">{formatDay(row.inputDate)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1.5">
                    {row.status === InputStatus.PENDING && meta.canMarkOkay && (
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => onSetStatus(row.id, InputStatus.ACCEPTED)}
                        title="Mark this stage as complete"
                      >
                        Okay
                      </Button>
                    )}
                    {row.status === InputStatus.PENDING && meta.canApprove && (
                      <Button size="sm" variant="danger" onClick={() => onSetStatus(row.id, InputStatus.REJECTED)}>
                        Reject
                      </Button>
                    )}
                    {row.status === InputStatus.ACCEPTED && meta.canApprove && (
                      <Button size="sm" variant="ghost" onClick={() => onSetStatus(row.id, InputStatus.PENDING)}>
                        Reopen
                      </Button>
                    )}
                    {!meta.canMarkOkay && !meta.canApprove && <span className="text-xs text-slate-300">Read only</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const swatch = (color: string) =>
  ({
    White: '#ffffff',
    'Off White': '#f5f2e8',
    Black: '#1f2937',
    Navy: '#1e2a44',
    Grey: '#9ca3af',
    Red: '#dc2626',
    Green: '#16a34a',
    Beige: '#e7d7bd',
    Maroon: '#7f1d1d',
    Sky: '#38bdf8',
  })[color] ?? '#e2e8f0';
