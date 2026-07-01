'use client';

import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '../core/lib/constants';
import { useAuth } from './useAuth';

/**
 * Opens (once) a single Socket.io connection per authenticated session
 * and joins a room matching the user's role, so backend can target
 * "all admins" vs "all users" separately if needed later.
 *
 * Usage in a container component:
 *   const socket = useSocket();
 *   useEffect(() => {
 *     socket?.on(SOCKET_EVENTS.INPUT_STATUS_UPDATED, (updated) => { ... });
 *     return () => { socket?.off(SOCKET_EVENTS.INPUT_STATUS_UPDATED); };
 *   }, [socket]);
 */
export function useSocket(): Socket | null {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    const socket = io(SOCKET_URL, { withCredentials: true });
    socketRef.current = socket;
    socket.emit('join', user.role);

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user]);

  return socketRef.current;
}
