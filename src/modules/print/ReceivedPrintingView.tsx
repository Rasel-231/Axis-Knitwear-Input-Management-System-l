'use client';

import { useState } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { StatCard } from '../../components/ui/StatCard';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { receivePrinting } from '../../core/store/slices/productionSlice';
import { selectPrints } from '../production/selectors';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_META } from '../../core/lib/roleMeta';
import { IPrintRecord } from '../../types';
import { PRINT_STATUS_LABELS, PRINT_STATUS_TONES, formatDayTime, formatQty } from '../production/helpers';
import { Role } from '../../types';

export default function ReceivedPrintingView() {
  const dispatch = useAppDispatch();
  const prints = useAppSelector(selectPrints);
  const { user } = useAuth();
  const meta = ROLE_META[(user?.role ?? Role.USER) as Role];

  const [search, setSearch] = useState('');
  const [active, setActive] = useState<IPrintRecord | null>(null);
  const [receivedQuantity, setReceivedQuantity] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [remarks, setRemarks] = useState('');

  const open = (row: IPrintRecord) => {
    setActive(row);
    setReceivedQuantity(String(row.receivedQuantity ?? row.sentQuantity));
    setReceivedBy(user?.name || user?.email || meta.label);
    setRemarks('');
  };

  const submitReceive = () => {
    if (!active) return;
    dispatch(
      receivePrinting({
        id: active.id,
        receivedQuantity: Number(receivedQuantity),
        receivedBy,
        remarks: remarks || undefined,
      }),
    );
    setActive(null);
  };

  const rows = prints.filter((row) => {
    if (row.status === 'RECEIVED') return false;
    const needle = search.trim().toLowerCase();
    if (!needle) return true;
    return [row.buyer, row.style, row.printType, row.lotBatch, row.line].some((v) =>
      v.toLowerCase().includes(needle),
    );
  });

  const outstanding = prints.reduce((sum, row) => sum + (row.status === 'RECEIVED' ? 0 : row.sentQuantity - (row.receivedQuantity ?? 0)), 0);

  return (
    <div>
      <PageHeader
        title="Received printing"
        description="Record what actually came back from the print vendor. Short quantities stay partially received."
        actions={
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search buyer, style, lot…"
            className="h-9 w-56 rounded-lg border border-slate-300 px-3 text-sm"
          />
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Open jobs" value={prints.filter((row) => row.status !== 'RECEIVED').length} tone="warning" />
        <StatCard label="Outstanding pcs" value={formatQty(outstanding)} hint="Sent but not received back" tone="danger" />
        <StatCard
          label="Fully received"
          value={prints.filter((row) => row.status === 'RECEIVED').length}
          tone="success"
        />
        <StatCard label="Total sent" value={formatQty(prints.reduce((sum, row) => sum + row.sentQuantity, 0))} />
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Buyer / Style</th>
                <th className="px-4 py-3 font-medium">Print type</th>
                <th className="px-4 py-3 font-medium">Lot / Batch</th>
                <th className="px-4 py-3 font-medium">Line</th>
                <th className="px-4 py-3 text-right font-medium">Sent</th>
                <th className="px-4 py-3 text-right font-medium">Received</th>
                <th className="px-4 py-3 font-medium">Sent on</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((row) => (
                <tr key={row.id} className="transition-colors hover:bg-slate-50/70">
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-900">{row.buyer}</span>
                    <span className="ml-2 text-xs text-slate-400">{row.style}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{row.printType}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">{row.lotBatch}</td>
                  <td className="px-4 py-3 text-slate-600">{row.line}</td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">{formatQty(row.sentQuantity)}</td>
                  <td className="px-4 py-3 text-right text-slate-700">{formatQty(row.receivedQuantity)}</td>
                  <td className="px-4 py-3 text-slate-500">{formatDayTime(row.sentAt)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={PRINT_STATUS_TONES[row.status]}>{PRINT_STATUS_LABELS[row.status]}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" onClick={() => open(row)}>
                      Receive
                    </Button>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                    Nothing to receive right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!active}
        title="Receive printing"
        description={active ? `${active.buyer} · ${active.style} · ${active.printType} · sent ${formatQty(active.sentQuantity)} pcs` : undefined}
        onClose={() => setActive(null)}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>
              Cancel
            </Button>
            <Button className="rounded-lg bg-slate-900 px-4 text-white hover:bg-slate-800" onClick={submitReceive}>
              Save receipt
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="r-qty" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Received quantity
            </label>
            <Input
              id="r-qty"
              type="number"
              min={0}
              value={receivedQuantity}
              onChange={(e) => setReceivedQuantity(e.target.value)}
              className="h-10 rounded-lg border border-slate-300"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="r-by" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Received by
            </label>
            <Input
              id="r-by"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              className="h-10 rounded-lg border border-slate-300"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="r-remark" className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Remarks
            </label>
            <Input
              id="r-remark"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Short supply, damage, replacement…"
              className="h-10 rounded-lg border border-slate-300"
            />
          </div>
          {active && Number(receivedQuantity) < active.sentQuantity && (
            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {formatQty(active.sentQuantity - Number(receivedQuantity))} pcs short — this will be marked as partially
              received.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
