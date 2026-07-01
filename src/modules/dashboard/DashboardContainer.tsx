'use client';

import { useEffect } from 'react';
import { WipSummaryTable } from './components/WipSummaryTable';
import { DemandProgress } from './components/DemandProgress';
import { useGetDashboardSummaryQuery, dashboardApi } from './api/dashboardApi';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { SOCKET_EVENTS } from '../../core/lib/constants';

/**
 * Single container used by BOTH (admin)/dashboard/page.tsx and
 * (user)/dashboard/page.tsx — read-only for both roles, since the
 * backend's /dashboard route only exposes GET. "Admin full control"
 * lives in the input module (Accept/Reject), not here.
 */
export default function DashboardContainer() {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const { data, isLoading } = useGetDashboardSummaryQuery();

  useEffect(() => {
    if (!socket) return;

    const refresh = () => dispatch(dashboardApi.util.invalidateTags(['Dashboard']));

    socket.on(SOCKET_EVENTS.INPUT_STATUS_UPDATED, refresh);
    socket.on(SOCKET_EVENTS.INPUT_CREATED, refresh);
    socket.on(SOCKET_EVENTS.DASHBOARD_WIP_UPDATED, refresh);

    return () => {
      socket.off(SOCKET_EVENTS.INPUT_STATUS_UPDATED, refresh);
      socket.off(SOCKET_EVENTS.INPUT_CREATED, refresh);
      socket.off(SOCKET_EVENTS.DASHBOARD_WIP_UPDATED, refresh);
    };
  }, [socket, dispatch]);

  if (isLoading) return <p className="text-sm text-gray-500">Loading dashboard...</p>;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="font-semibold mb-3">Work In Progress</h2>
        <WipSummaryTable data={data?.data?.wip || []} />
      </section>
      <section>
        <h2 className="font-semibold mb-3">Demand vs Achieved</h2>
        <DemandProgress data={data?.data?.demand || []} />
      </section>
    </div>
  );
}
