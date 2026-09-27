'use client';

import { useMemo, useState } from 'react';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { PRODUCTION_LINES, buildLineOutputs } from '../../core/lib/mockData';
import { LineChartCard } from './LineChartCard';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { selectReadyToShip, selectUpcomingInputs, selectWipSummary } from '../selectors';
import { STAGE_LABELS, STATUS_LABELS, STATUS_TONES, formatDay, formatQty } from '../helpers';
import { InputStatus, ProductionStage, Role } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_META } from '../../core/lib/roleMeta';

export default function ProductionDashboardView() {
  const inputs = useAppSelector((state) => state.production.inputs);
  const wip = useAppSelector(selectWipSummary);
  const upcoming = useAppSelector(selectUpcomingInputs);
  const readyToShip = useAppSelector(selectReadyToShip);
  const { user } = useAuth();
  const meta = ROLE_META[(user?.role ?? Role.USER) as Role];
  const [activeLine, setActiveLine] = useState<string | undefined>(undefined);

  const charts = useMemo(
    () => PRODUCTION_LINES.map((line) => ({ line, data: buildLineOutputs(line, inputs) })),
    [inputs],
  );

  const pending = wip.filter((row) => row.status === InputStatus.PENDING);
  const pendingQuantity = pending.reduce((sum, row) => sum + row.quantity, 0);
  const activeLines = new Set(inputs.map((row) => row.line)).size;

  return (
    <div>
      <PageHeader
        title="Production dashboard"
        description={`${meta.label} view — work in progress, day-wise line output and everything waiting to move.`}
        actions={
          activeLine ? (
            <button
              type="button"
              onClick={() => setActiveLine(undefined)}
              className="rounded-full border border-slate-900 bg-slate-900 px-3 py-1 text-xs font-medium text-white"
            >
              {activeLine} · clear
            </button>
          ) : (
            <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
              {activeLines} of 36 lines active
            </span>
          )
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Pending input"
          value={formatQty(pendingQuantity)}
          hint={`${pending.reduce((sum, row) => sum + row.count, 0)} records waiting`}
          tone="warning"
        />
        <StatCard
          label="Ready to print"
          value={readyToShip.length}
          hint="Inspected and marked okay"
          tone="success"
        />
        <StatCard
          label="Active lines"
          value={`${activeLines} / 36`}
          hint="Tap a chart to focus one line"
          tone="info"
        />
        <StatCard
          label="Rejected"
          value={wip.filter((row) => row.status === InputStatus.REJECTED).reduce((sum, row) => sum + row.count, 0)}
          hint="Sent back for rework"
          tone="danger"
        />
      </div>

      <section className="mt-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">Day-wise input by production line</h2>
          <p className="text-xs text-slate-500">Last 12 days · one card per line · 36 lines</p>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {charts.map((chart) => (
            <LineChartCard
              key={chart.line}
              line={chart.line}
              data={chart.data}
              active={activeLine === chart.line}
              onSelect={(line) => setActiveLine((prev) => (prev === line ? undefined : line))}
            />
          ))}
        </div>
      </section>

      <div className="mt-8 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Work in progress by stage</h2>
            <span className="text-xs text-slate-400">Input status matrix</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="py-2 font-medium">Stage</th>
                  <th className="py-2 text-right font-medium">Pending</th>
                  <th className="py-2 text-right font-medium">Okay</th>
                  <th className="py-2 text-right font-medium">Rejected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {Object.values(ProductionStage).map((stage) => {
                  const row = (status: InputStatus) =>
                    wip.find((item) => item.stage === stage && item.status === status);
                  const pendingCell = row(InputStatus.PENDING);
                  const okayCell = row(InputStatus.ACCEPTED);
                  const rejectedCell = row(InputStatus.REJECTED);

                  return (
                    <tr key={stage}>
                      <td className="py-2.5 font-medium text-slate-800">{STAGE_LABELS[stage]}</td>
                      <td className="py-2.5 text-right text-amber-700">
                        {pendingCell ? `${pendingCell.count} · ${formatQty(pendingCell.quantity)}` : '—'}
                      </td>
                      <td className="py-2.5 text-right text-emerald-700">
                        {okayCell ? `${okayCell.count} · ${formatQty(okayCell.quantity)}` : '—'}
                      </td>
                      <td className="py-2.5 text-right text-red-700">
                        {rejectedCell ? `${rejectedCell.count} · ${formatQty(rejectedCell.quantity)}` : '—'}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-slate-50 font-medium">
                  <td className="py-2.5 text-slate-700">Total</td>
                  {([InputStatus.PENDING, InputStatus.ACCEPTED, InputStatus.REJECTED] as InputStatus[]).map((status) => (
                    <td key={status} className="py-2.5 text-right text-slate-900">
                      {formatQty(
                        wip.filter((row) => row.status === status).reduce((sum, row) => sum + row.quantity, 0),
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900">Upcoming input</h2>
            <span className="text-xs text-slate-400">All pending records</span>
          </div>
          <ul className="divide-y divide-slate-100">
            {upcoming.map((row) => (
              <li key={row.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">
                    {row.buyer} · {row.style}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {STAGE_LABELS[row.stage]} · {row.cutting} · {row.color} · {row.lotBatch} · {row.line}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-sm font-medium text-slate-900">{formatQty(row.quantity)}</span>
                  <Badge variant={STATUS_TONES[row.status]}>{STATUS_LABELS[row.status]}</Badge>
                </div>
              </li>
            ))}
            {upcoming.length === 0 && <li className="py-6 text-center text-sm text-slate-400">Nothing pending.</li>}
          </ul>
        </section>
      </div>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-900">Ready for printing</h2>
          <span className="text-xs text-slate-400">Inspected bodies cleared by IE</span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {readyToShip.slice(0, 9).map((row) => (
            <div key={row.id} className="rounded-lg border border-slate-200 px-3 py-2.5">
              <p className="text-sm font-medium text-slate-900">
                {row.buyer} · {row.style}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {row.cutting} · {row.color} · {formatQty(row.quantity)} pcs · {row.line}
              </p>
              <p className="mt-0.5 text-[11px] text-slate-400">
                {formatDay(row.inputDate)} · {row.enteredBy}
              </p>
            </div>
          ))}
          {readyToShip.length === 0 && (
            <p className="col-span-full py-4 text-center text-sm text-slate-400">
              No inspected body is marked Okay yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
