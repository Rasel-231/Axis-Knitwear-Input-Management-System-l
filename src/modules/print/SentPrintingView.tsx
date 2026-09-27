'use client';

import { FormEvent, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Field } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { sendPrinting } from '../../core/store/slices/productionSlice';
import { selectReadyToPrintRows } from '../production/selectors';
import { useAuth } from '../../hooks/useAuth';
import { ROLE_META } from '../../core/lib/roleMeta';
import { BUYERS, COLORS, CUTTINGS, PRINT_TYPES, PRODUCTION_LINES, STYLES_BY_BUYER } from '../../core/lib/mockData';
import { formatQty } from '../production/helpers';
import { Role } from '../../types';

const controlClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10';

export default function SentPrintingView() {
  const dispatch = useAppDispatch();
  const readyRows = useAppSelector(selectReadyToPrintRows);
  const { user } = useAuth();
  const meta = ROLE_META[(user?.role ?? Role.USER) as Role];

  const [buyer, setBuyer] = useState('');
  const [style, setStyle] = useState('');
  const [cutting, setCutting] = useState('');
  const [color, setColor] = useState('');
  const [lotBatch, setLotBatch] = useState('');
  const [printType, setPrintType] = useState(PRINT_TYPES[0]);
  const [line, setLine] = useState('');
  const [sentQuantity, setSentQuantity] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const styleOptions = buyer ? STYLES_BY_BUYER[buyer] ?? [] : [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!buyer || !style || !cutting || !color || !lotBatch || !line || !sentQuantity) {
      setError('Every field is required to send a print job to the vendor.');
      return;
    }
    setError('');

    dispatch(
      sendPrinting(
        {
          buyer,
          style,
          cutting,
          color,
          lotBatch,
          printType,
          line,
          sentQuantity: Number(sentQuantity),
          remarks: remarks || undefined,
        },
        user?.name || user?.email || meta.label,
      ),
    );

    setSentQuantity('');
    setRemarks('');
    setSaved(true);
  };

  return (
    <div>
      <PageHeader
        title="Sent printing"
        description="Send inspected bodies to the print vendor. The record stays open until printing is received back."
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Buyer" required htmlFor="s-buyer">
              <Select
                id="s-buyer"
                value={buyer}
                onChange={(e) => {
                  setBuyer(e.target.value);
                  setStyle('');
                }}
                className={controlClass}
              >
                <option value="">Select buyer</option>
                {BUYERS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Style" required htmlFor="s-style">
              <Select
                id="s-style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                disabled={!buyer}
                className={controlClass}
              >
                <option value="">Select style</option>
                {styleOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Cutting" required htmlFor="s-cutting">
              <Select id="s-cutting" value={cutting} onChange={(e) => setCutting(e.target.value)} className={controlClass}>
                <option value="">Select cutting</option>
                {CUTTINGS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Color" required htmlFor="s-color">
              <Select id="s-color" value={color} onChange={(e) => setColor(e.target.value)} className={controlClass}>
                <option value="">Select color</option>
                {COLORS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Lot / Batch" required htmlFor="s-lot">
              <Input
                id="s-lot"
                value={lotBatch}
                onChange={(e) => setLotBatch(e.target.value)}
                placeholder="LOT-0000"
                className={controlClass}
              />
            </Field>

            <Field label="Print type" required htmlFor="s-type">
              <Select id="s-type" value={printType} onChange={(e) => setPrintType(e.target.value)} className={controlClass}>
                {PRINT_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Production line" required htmlFor="s-line">
              <Select id="s-line" value={line} onChange={(e) => setLine(e.target.value)} className={controlClass}>
                <option value="">Select line</option>
                {PRODUCTION_LINES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Sent quantity" required htmlFor="s-qty">
              <Input
                id="s-qty"
                type="number"
                min={1}
                value={sentQuantity}
                onChange={(e) => setSentQuantity(e.target.value)}
                placeholder="0"
                className={controlClass}
              />
            </Field>

            <Field label="Remarks" htmlFor="s-remarks" className="sm:col-span-2">
              <Input
                id="s-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Vendor, delivery date, anything the print team needs"
                className={controlClass}
              />
            </Field>
          </div>

          {error && (
            <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
          {saved && (
            <p className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              Printing sent. Track it under “Received printing”.
            </p>
          )}

          <div className="mt-6 border-t border-slate-100 pt-5">
            <Button type="submit" className="h-10 rounded-lg bg-slate-900 px-5 text-sm text-white hover:bg-slate-800">
              Send to print vendor
            </Button>
          </div>
        </form>

        <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900">Waiting in inspection</h2>
          <p className="mt-1 text-xs text-slate-500">Bodies the IE has already cleared, ready to be sent for printing.</p>
          <ul className="mt-4 space-y-2">
            {readyRows.slice(0, 8).map((row) => (
              <li key={row.id} className="rounded-lg border border-slate-200 px-3 py-2">
                <p className="text-sm font-medium text-slate-900">
                  {row.buyer} · {row.style}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {row.cutting} · {row.color} · {formatQty(row.quantity)} pcs · {row.line}
                </p>
              </li>
            ))}
            {readyRows.length === 0 && <li className="py-4 text-center text-sm text-slate-400">Nothing waiting.</li>}
          </ul>
        </aside>
      </div>
    </div>
  );
}
