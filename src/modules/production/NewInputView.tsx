'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Field } from '../../components/ui/Field';
import { PageHeader } from '../../components/ui/PageHeader';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { useAuth } from '../../hooks/useAuth';
import { addInput } from '../../core/store/slices/productionSlice';
import { ROLE_META } from '../../core/lib/roleMeta';
import { BUYERS, COLORS, CUTTINGS, PRODUCTION_LINES, STYLES_BY_BUYER } from '../../core/lib/mockData';
import { STAGE_LABELS, formatQty } from '../helpers';
import { InputStatus, ProductionStage, Role } from '../../types';

const STATUS_OPTIONS: { value: InputStatus; label: string; hint: string }[] = [
  { value: InputStatus.PENDING, label: 'Pending', hint: 'Waiting for the next stage' },
  { value: InputStatus.ACCEPTED, label: 'Okay', hint: 'Work completed' },
  { value: InputStatus.REJECTED, label: 'Rejected', hint: 'Sent back for rework' },
];

const inputClass =
  'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10';

export default function NewInputView() {
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const role = (user?.role ?? Role.USER) as Role;
  const meta = ROLE_META[role];

  const [buyer, setBuyer] = useState('');
  const [style, setStyle] = useState('');
  const [cutting, setCutting] = useState('');
  const [color, setColor] = useState('');
  const [lotBatch, setLotBatch] = useState('');
  const [bundleNo, setBundleNo] = useState('');
  const [quantity, setQuantity] = useState('');
  const [status, setStatus] = useState<InputStatus>(InputStatus.PENDING);
  const [stage, setStage] = useState<ProductionStage>(meta.stage ?? ProductionStage.CUTTING);
  const [line, setLine] = useState('');
  const [remarks, setRemarks] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const styleOptions = useMemo(() => (buyer ? STYLES_BY_BUYER[buyer] ?? [] : []), [buyer]);

  // The Rib Super Visor enters collar/bottom right after cutting it, so a
  // bundle number does not exist yet — it appears from the Cutting stage on.
  const needsBundleNo = stage !== ProductionStage.RIB;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(false);

    if (!buyer || !style || !cutting || !color || !lotBatch || !line) {
      setError('Buyer, style, cutting, color, lot/batch and line are all required.');
      return;
    }
    if (needsBundleNo && !bundleNo) {
      setError('Bundle number is required once cutting is released.');
      return;
    }
    setError('');

    dispatch(
      addInput({
        buyer,
        style,
        cutting,
        color,
        lotBatch,
        bundleNo: needsBundleNo ? bundleNo : '',
        quantity: quantity ? Number(quantity) : undefined,
        status,
        stage,
        line,
        inputDate: new Date().toISOString(),
        remarks: remarks || undefined,
        enteredBy: user?.name || user?.email || meta.label,
        enteredByRole: role,
      }),
    );

    setBundleNo('');
    setQuantity('');
    setRemarks('');
    setSaved(true);
  };

  if (!meta.canCreateInput) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <p className="text-sm font-medium text-slate-700">No input form for this role</p>
        <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
          {meta.label} works from the dashboard, the upcoming input list and the filters.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`New ${meta.stage ? STAGE_LABELS[meta.stage] : ''} input`.replace('  ', ' ')}
        description={meta.description}
        actions={
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600">
            Entered as {meta.label}
          </span>
        }
      />

      <form onSubmit={handleSubmit} className="max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Buyer" required htmlFor="buyer">
            <Select
              id="buyer"
              value={buyer}
              onChange={(e) => {
                setBuyer(e.target.value);
                setStyle('');
              }}
              className={inputClass}
            >
              <option value="">Select buyer</option>
              {BUYERS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Style" required htmlFor="style" hint={buyer ? undefined : 'Pick a buyer first'}>
            <Select
              id="style"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              disabled={!buyer}
              className={inputClass}
            >
              <option value="">Select style</option>
              {styleOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Cutting" required htmlFor="cutting">
            <Select id="cutting" value={cutting} onChange={(e) => setCutting(e.target.value)} className={inputClass}>
              <option value="">Select cutting</option>
              {CUTTINGS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Color" required htmlFor="color">
            <Select id="color" value={color} onChange={(e) => setColor(e.target.value)} className={inputClass}>
              <option value="">Select color</option>
              {COLORS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Lot / Batch" required htmlFor="lotBatch">
            <Input
              id="lotBatch"
              value={lotBatch}
              onChange={(e) => setLotBatch(e.target.value)}
              placeholder="LOT-0000"
              className={inputClass}
              required
            />
          </Field>

          <Field
            label="Bundle No"
            htmlFor="bundleNo"
            required={needsBundleNo}
            hint={needsBundleNo ? undefined : 'Not applicable at rib stage'}
          >
            <Input
              id="bundleNo"
              value={bundleNo}
              onChange={(e) => setBundleNo(e.target.value)}
              placeholder={needsBundleNo ? 'BDL-0000' : 'Assigned at cutting'}
              disabled={!needsBundleNo}
              className={inputClass}
            />
          </Field>

          <Field label="Quantity (optional)" htmlFor="quantity" hint="Leave empty if not measured yet">
            <Input
              id="quantity"
              type="number"
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
              className={inputClass}
            />
          </Field>

          <Field label="Stage" htmlFor="stage" hint="Where this input is being reported">
            <Select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value as ProductionStage)}
              className={inputClass}
            >
              {Object.values(ProductionStage).map((item) => (
                <option key={item} value={item}>
                  {STAGE_LABELS[item]}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Status" htmlFor="status" hint={STATUS_OPTIONS.find((o) => o.value === status)?.hint}>
            <Select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as InputStatus)}
              className={inputClass}
            >
              {STATUS_OPTIONS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Production line" required htmlFor="line">
            <Select id="line" value={line} onChange={(e) => setLine(e.target.value)} className={inputClass}>
              <option value="">Select line</option>
              {PRODUCTION_LINES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Remarks" htmlFor="remarks" className="sm:col-span-2">
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={2}
              placeholder="Optional note for the next stage"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </Field>
        </div>

        {error && (
          <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {saved && (
          <p className="mt-5 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            Input saved. It now shows in the input list, the WIP dashboard and the line charts.
          </p>
        )}

        <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
          <Button
            type="submit"
            className="h-10 rounded-lg bg-slate-900 px-5 text-sm text-white hover:bg-slate-800"
          >
            Save input
          </Button>
          <span className="text-xs text-slate-400">
            {needsBundleNo ? 'Bundle number required' : 'Rib stage — no bundle number'}
            {quantity ? ` · ${formatQty(Number(quantity))} pcs` : ' · quantity optional'}
          </span>
        </div>
      </form>
    </div>
  );
}
