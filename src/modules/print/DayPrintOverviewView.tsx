'use client';

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { Badge } from '../../components/ui/Badge';
import { useAppSelector } from '../../hooks/useAppDispatch';
import { selectPrints, selectPrintSummary } from '../production/selectors';
import { PRINT_STATUS_LABELS, PRINT_STATUS_TONES, formatDay, formatQty } from '../production/helpers';
import { PrintStatus } from '../../types';

type DayRow = {
  day: string;
  sent: number;
  received: number;
  pending: number;
};

const bucketByDay = (rows: ReturnType<typeof selectPrints>): DayRow[] => {
  const map = new Map<string, DayRow>();

  rows.forEach((row) => {
    const day = formatDay(row.sentAt);
    const current = map.get(day) ?? { day, sent: 0, received: 0, pending: 0 };
    current.sent += row.sentQuantity;
    current.received += row.receivedQuantity ?? 0;
    current.pending += row.sentQuantity - (row.receivedQuantity ?? 0);
    map.set(day, current);
  });

  return Array.from(map.values())
    .sort((a, b) => (a.day < b.day ? 1 : -1))
    .slice(0, 10)
    .reverse();
};

export default function DayPrintOverviewView() {
  const prints = useAppSelector(selectPrints);
  const summary = useAppSelector(selectPrintSummary);
  const days = useMemo(() => bucketByDay(prints), [prints]);

  return (
    <div>
      <PageHeader
        title="Overview — day print body"
        description="Sent versus received printing per day, and which bodies are still open."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total sent" value={formatQty(summary.sent)} tone="info" />
        <StatCard label="Total received" value={formatQty(summary.received)} tone="success" />
        <StatCard label="Still pending" value={formatQty(summary.pending)} tone="warning" />
        <StatCard label="Jobs awaiting" value={summary.awaiting} hint="No receipt recorded yet" tone="danger" />
      </div>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Printing sent vs received by day</h2>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={days} margin={{ top: 4, right: 8, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 11 }}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="sent" name="Sent" fill="#334155" radius={[3, 3, 0, 0]} />
              <Bar dataKey="received" name="Received" fill="#10b981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3">
          <h2 className="text-sm font-semibold text-slate-900">Print body register</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Job</th>
                <th className="px-4 py-3 font-medium">Buyer / Style</th>
                <th className="px-4 py-3 font-medium">Print type</th>
                <th className="px-4 py-3 text-right font-medium">Sent</th>
                <th className="px-4 py-3 text-right font-medium">Received</th>
                <th className="px-4 py-3 text-right font-medium">Balance</th>
                <th className="px-4 py-3 font-medium">Received on</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prints.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-mono text-xs text-slate-500">{row.id}</td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{row.buyer}</span>
                    <span className="ml-2 text-xs text-slate-400">{row.style}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.printType}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatQty(row.sentQuantity)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatQty(row.receivedQuantity)}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    {formatQty(row.sentQuantity - (row.receivedQuantity ?? 0))}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.receivedAt ? formatDay(row.receivedAt) : '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={PRINT_STATUS_TONES[row.status]}>{PRINT_STATUS_LABELS[row.status]}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Object.values(PrintStatus).map((status) => {
          const rows = prints.filter((row) => row.status === status);
          return (
            <div key={status} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <Badge variant={PRINT_STATUS_TONES[status]}>{PRINT_STATUS_LABELS[status]}</Badge>
                <span className="text-lg font-semibold text-slate-900">{rows.length}</span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {formatQty(rows.reduce((sum, row) => sum + row.sentQuantity, 0))} pcs sent in total
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
