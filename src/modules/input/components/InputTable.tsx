'use client';

import { IInput, InputStatus } from '../../../types';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { formatDate } from '../../../core/lib/utils';

type Props = {
  data: IInput[];
  isAdmin: boolean;
  onUpdateStatus?: (id: string, status: InputStatus) => void;
};

const statusVariant: Record<InputStatus, 'pending' | 'success' | 'danger'> = {
  PENDING: 'pending',
  ACCEPTED: 'success',
  REJECTED: 'danger',
};

// Presenter: renders a status-cycle table. Admin sees Accept/Reject
// actions on PENDING rows; User sees the same table but read-only.
export function InputTable({ data, isAdmin, onUpdateStatus }: Props) {
  return (
    <table className="w-full text-sm border-collapse">
      <thead>
        <tr className="text-left border-b text-gray-500">
          <th className="py-2">Type</th>
          <th className="py-2">Qty</th>
          <th className="py-2">Remarks</th>
          <th className="py-2">Status</th>
          <th className="py-2">Date</th>
          {isAdmin && <th className="py-2">Actions</th>}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={row.id} className="border-b last:border-0">
            <td className="py-2">{row.type}</td>
            <td className="py-2">{row.quantity}</td>
            <td className="py-2 text-gray-500">{row.remarks || '-'}</td>
            <td className="py-2">
              <Badge variant={statusVariant[row.status]}>{row.status}</Badge>
            </td>
            <td className="py-2 text-gray-500">{formatDate(row.createdAt)}</td>
            {isAdmin && (
              <td className="py-2 flex gap-2">
                {row.status === 'PENDING' && (
                  <>
                    <Button size="sm" variant="success" onClick={() => onUpdateStatus?.(row.id, 'ACCEPTED' as InputStatus)}>
                      Accept
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => onUpdateStatus?.(row.id, 'REJECTED' as InputStatus)}>
                      Reject
                    </Button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
