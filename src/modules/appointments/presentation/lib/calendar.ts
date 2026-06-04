import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  startOfDay,
  endOfDay,
  addMinutes,
  parseISO,
  format,
} from 'date-fns';
import type { Appointment } from '../../domain/appointment';

export const DAY_START_HOUR = 8;
export const DAY_END_HOUR = 20;
export const PX_PER_HOUR = 64;
export const SNAP_MINUTES = 15;

export function weekDays(date: Date): Date[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
}

export function dayRange(date: Date): { start: Date; end: Date } {
  return { start: startOfDay(date), end: endOfDay(date) };
}

export function hourSlots(startHour = DAY_START_HOUR, endHour = DAY_END_HOUR): number[] {
  const slots: number[] = [];
  for (let h = startHour; h <= endHour; h++) slots.push(h);
  return slots;
}

export interface BlockGeometry {
  top: number;
  height: number;
}

export function blockGeometry(
  appt: Pick<Appointment, 'start' | 'durationMin'>,
  dayStartHour = DAY_START_HOUR,
  pxPerHour = PX_PER_HOUR
): BlockGeometry {
  const start = parseISO(appt.start);
  const startMinutes = start.getHours() * 60 + start.getMinutes() - dayStartHour * 60;
  const top = (startMinutes / 60) * pxPerHour;
  const height = (appt.durationMin / 60) * pxPerHour;
  return { top, height };
}

export function pointToTime(
  yPx: number,
  referenceDate: Date,
  dayStartHour = DAY_START_HOUR,
  pxPerHour = PX_PER_HOUR,
  snapMin = SNAP_MINUTES
): string {
  const rawMinutes = (yPx / pxPerHour) * 60;
  const snapped = Math.round(rawMinutes / snapMin) * snapMin;
  const hours = dayStartHour + Math.floor(snapped / 60);
  const minutes = snapped % 60;
  const d = new Date(referenceDate);
  d.setHours(hours, minutes, 0, 0);
  return format(d, "yyyy-MM-dd'T'HH:mm:ss");
}

export interface ColumnLayout {
  column: number;
  totalColumns: number;
}

export function layoutOverlaps(dayAppts: Appointment[]): Map<string, ColumnLayout> {
  const result = new Map<string, ColumnLayout>();
  const active = dayAppts.filter(a => a.status !== 'cancelled');

  active.forEach((appt, i) => {
    const aStart = parseISO(appt.start);
    const aEnd = addMinutes(aStart, appt.durationMin);

    const overlapping = active.filter((other, j) => {
      if (j === i) return false;
      const bStart = parseISO(other.start);
      const bEnd = addMinutes(bStart, other.durationMin);
      return aStart < bEnd && aEnd > bStart;
    });

    if (overlapping.length === 0) {
      result.set(appt.id, { column: 0, totalColumns: 1 });
    } else {
      const groupSize = overlapping.length + 1;
      const usedColumns = overlapping
        .map(o => result.get(o.id)?.column)
        .filter((c): c is number => c !== undefined);
      let col = 0;
      while (usedColumns.includes(col)) col++;
      result.set(appt.id, { column: col, totalColumns: groupSize });
    }
  });

  return result;
}

export function isoToDate(iso: string): Date {
  return parseISO(iso);
}

export function formatHour(hour: number): string {
  return `${String(hour).padStart(2, '0')}:00`;
}
