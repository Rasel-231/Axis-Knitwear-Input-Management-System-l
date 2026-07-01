import { IDemandItem } from '../../../types';

export function DemandProgress({ data }: { data: IDemandItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      {data.map((item) => {
        const pct = Math.min(100, Math.round((item.achievedQuantity / item.targetQuantity) * 100));
        return (
          <div key={item.type}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{item.type}</span>
              <span className="text-gray-500">
                {item.achievedQuantity} / {item.targetQuantity} ({pct}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-black h-2 rounded-full" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
