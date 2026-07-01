'use client';

import { useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { InputTable } from './components/InputTable';
import { useGetInputsQuery, useCreateInputMutation, useUpdateInputStatusMutation, inputApi } from './api/inputApi';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { InputType, InputStatus } from '../../types';
import { SOCKET_EVENTS } from '../../core/lib/constants';

/**
 * Generic container, parameterized by `type` (CUTTING / SEWING / RIB).
 * Owns: data fetching (RTK Query), mutations, and the real-time socket
 * subscription that keeps the table in sync without polling.
 *
 * SewingContainer.tsx / CuttingContainer.tsx / RibContainer.tsx are thin
 * wrappers around this so each still exists as its own file per the
 * module structure, while avoiding copy-pasted logic three times.
 */
export function InputContainer({ type }: { type: InputType }) {
  const { isAdmin } = useAuth();
  const dispatch = useAppDispatch();
  const socket = useSocket();

  const { data, isLoading } = useGetInputsQuery({ type });
  const [createInput, { isLoading: isCreating }] = useCreateInputMutation();
  const [updateStatus] = useUpdateInputStatusMutation();

  // Real-time: whenever the backend emits a create/status-update event
  // for this input type, invalidate the RTK Query cache so the table
  // refetches instantly instead of waiting for the next manual refresh.
  useEffect(() => {
    if (!socket) return;

    const handleUpdate = () => {
      dispatch(inputApi.util.invalidateTags(['Input']));
    };

    socket.on(SOCKET_EVENTS.INPUT_CREATED, handleUpdate);
    socket.on(SOCKET_EVENTS.INPUT_STATUS_UPDATED, handleUpdate);

    return () => {
      socket.off(SOCKET_EVENTS.INPUT_CREATED, handleUpdate);
      socket.off(SOCKET_EVENTS.INPUT_STATUS_UPDATED, handleUpdate);
    };
  }, [socket, dispatch]);

  const rows = (data?.data || []).filter((row) => row.type === type);

  return (
    <div className="flex flex-col gap-6">
      <InputForm type={type} isLoading={isCreating} onSubmit={(values) => createInput({ type, ...values })} />
      {isLoading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <InputTable
          data={rows}
          isAdmin={isAdmin}
          onUpdateStatus={(id, status: InputStatus) => updateStatus({ id, status })}
        />
      )}
    </div>
  );
}
