import { IWipSummaryItem } from '../../../types';
import { Badge } from '../../../components/ui/Badge';

const statusVariant: Record<string, 'pending' | 'success' | 'danger'> = {
  PENDING: 'pending',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

// Presenter — pure display, no fetching. Same component for Admin
// (full view) and User (read-only view); read-only-ness comes from the
// absence of any action buttons here, not from a prop flag.
export function WipSummaryTable({ data }: { data: IWipSummaryItem[] }) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b text-gray-500">
          <th className="py-2">Type</th>
          <th className="py-2">Status</th>
          <th className="py-2">Qty</th>
          <th className="py-2">Count</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, i) => (
          <tr key={i} className="border-b last:border-0">
            <td className="py-2">{row.type}</td>
            <td className="py-2">
              <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
            </td>
            <td className="py-2">{row.totalQuantity}</td>
            <td className="py-2">{row.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
