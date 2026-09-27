'use client';

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { ILineOutput } from '../../types';
import { formatQty } from '../helpers';

type Props = {
  line: string;
  data: ILineOutput[];
  active?: boolean;
  onSelect?: (line: string) => void;
};

export function LineChartCard({ line, data, active, onSelect }: Props) {
  const total = data.reduce((sum, point) => sum + point.quantity, 0);
  const peak = data.reduce((max, point) => Math.max(max, point.quantity), 0);

  return (
    <button
      type="button"
      onClick={() => onSelect?.(line)}
      className={`group flex flex-col rounded-xl border bg-white p-3 text-left shadow-sm transition ${
        active
          ? 'border-slate-900 ring-1 ring-slate-900'
          : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
      }`}
    >
      <div className="mb-1 flex items-baseline justify-between gap-2">
        <span className="text-xs font-semibold text-slate-900">{line}</span>
        <span className="text-[10px] uppercase tracking-wide text-slate-400">{formatQty(total)} pcs</span>
      </div>

      <div className="h-20 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }} barCategoryGap="22%">
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={14}
              tick={{ fontSize: 9, fill: '#94a3b8' }}
            />
            <Tooltip
              cursor={{ fill: '#f1f5f9' }}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #e2e8f0',
                fontSize: 11,
                padding: '6px 8px',
              }}
              labelStyle={{ color: '#0f172a', fontWeight: 600 }}
              formatter={(value: number) => [formatQty(value), 'Input']}
            />
            <Bar dataKey="quantity" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {data.map((point, index) => (
                <Cell
                  key={point.date}
                  fill={
                    active || (peak > 0 && point.quantity === peak) ? '#0f172a' : index % 2 === 0 ? '#334155' : '#475569'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </button>
  );
}
