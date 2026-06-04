'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { startOfWeek, endOfWeek, addWeeks, format } from 'date-fns';
import { toast } from 'sonner';
import {
  useListAppointments,
  useRescheduleAppointment,
  useCancelAppointment,
  useCreateAppointment,
} from '@/lib/container';
import type { Appointment } from '../../domain/appointment';
import type { CreateAppointmentInput } from '../../application/use-cases/create-appointment.use-case';
import type { RescheduleInput } from '../../application/use-cases/reschedule-appointment.use-case';

function weekRange(date: Date): { from: string; to: string } {
  const from = startOfWeek(date, { weekStartsOn: 1 });
  const to = endOfWeek(date, { weekStartsOn: 1 });
  return {
    from: format(from, "yyyy-MM-dd'T'00:00:00"),
    to: format(addWeeks(to, 0), "yyyy-MM-dd'T'23:59:59"),
  };
}

export function useAppointments(anchorDate: Date) {
  const listUseCase = useListAppointments();
  const rescheduleUseCase = useRescheduleAppointment();
  const cancelUseCase = useCancelAppointment();
  const createUseCase = useCreateAppointment();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const prevRangeRef = useRef('');

  const load = useCallback(
    async (date: Date) => {
      const range = weekRange(date);
      const key = `${range.from}|${range.to}`;
      if (key === prevRangeRef.current) return;
      prevRangeRef.current = key;
      setLoading(true);
      try {
        const data = await listUseCase.execute(range);
        setAppointments(data);
      } finally {
        setLoading(false);
      }
    },
    [listUseCase]
  );

  useEffect(() => {
    load(anchorDate);
  }, [anchorDate, load]);

  const reschedule = useCallback(
    async (input: RescheduleInput) => {
      const prev = appointments.find(a => a.id === input.id);
      if (!prev) return;

      setAppointments(curr =>
        curr.map(a =>
          a.id === input.id
            ? { ...a, start: input.start, durationMin: input.durationMin ?? a.durationMin }
            : a
        )
      );

      try {
        const updated = await rescheduleUseCase.execute(input);
        setAppointments(curr => curr.map(a => (a.id === updated.id ? updated : a)));
      } catch (err) {
        setAppointments(curr => curr.map(a => (a.id === prev.id ? prev : a)));
        throw err;
      }
    },
    [appointments, rescheduleUseCase]
  );

  const cancel = useCallback(
    async (id: string) => {
      const prev = appointments.find(a => a.id === id);
      if (!prev) return;

      setAppointments(curr => curr.map(a => (a.id === id ? { ...a, status: 'cancelled' } : a)));

      try {
        const updated = await cancelUseCase.execute(id);
        setAppointments(curr => curr.map(a => (a.id === updated.id ? updated : a)));
      } catch (err) {
        setAppointments(curr => curr.map(a => (a.id === prev.id ? prev : a)));
        throw err;
      }
    },
    [appointments, cancelUseCase]
  );

  const create = useCallback(
    async (input: CreateAppointmentInput) => {
      const created = await createUseCase.execute(input);
      setAppointments(curr => [...curr, created]);
      return created;
    },
    [createUseCase]
  );

  const handleConflictError = useCallback((err: unknown) => {
    const msg = err instanceof Error ? err.message : 'Schedule conflict';
    toast.error(msg);
  }, []);

  return { appointments, loading, reschedule, cancel, create, handleConflictError, reload: load };
}
