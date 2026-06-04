'use client';

import { useRef, useEffect, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { isSameDay, isToday, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AppointmentBlock } from './AppointmentBlock';
import { hasConflict } from '../domain/conflict';
import {
  hourSlots,
  blockGeometry,
  layoutOverlaps,
  formatHour,
  DAY_START_HOUR,
  DAY_END_HOUR,
  PX_PER_HOUR,
} from './lib/calendar';
import type { Appointment } from '../domain/appointment';

const TOTAL_HEIGHT = (DAY_END_HOUR - DAY_START_HOUR) * PX_PER_HOUR;
const hours = hourSlots(DAY_START_HOUR, DAY_END_HOUR - 1);

interface Props {
  day: Date;
  appointments: Appointment[];
  onSlotClick: (iso: string) => void;
  onAppointmentClick: (appt: Appointment) => void;
}

function calcNowTopForDay(day: Date): number | null {
  if (!isToday(day)) return null;
  const now = new Date();
  const mins = now.getHours() * 60 + now.getMinutes() - DAY_START_HOUR * 60;
  if (mins < 0 || mins > (DAY_END_HOUR - DAY_START_HOUR) * 60) return null;
  return (mins / 60) * PX_PER_HOUR;
}

export function DayView({ day, appointments, onSlotClick, onAppointmentClick }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowTop, setNowTop] = useState<number | null>(() => calcNowTopForDay(day));

  useEffect(() => {
    setNowTop(calcNowTopForDay(day));
    const timer = setInterval(() => setNowTop(calcNowTopForDay(day)), 60000);
    return () => clearInterval(timer);
  }, [day]);

  useEffect(() => {
    if (scrollRef.current && nowTop !== null) {
      scrollRef.current.scrollTop = Math.max(0, nowTop - 120);
    }
  }, [nowTop]);

  const dayKey = format(day, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({ id: dayKey });
  const dayAppts = appointments.filter(a => isSameDay(parseISO(a.start), day));
  const layout = layoutOverlaps(dayAppts);

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card">
      <div
        className={cn(
          'flex items-center justify-center border-b border-border py-3',
          isToday(day) && 'bg-primary/5'
        )}
      >
        <span
          className={cn(
            'mr-2 text-[11px] font-medium tracking-wider uppercase',
            isToday(day) ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          {format(day, 'EEEE')}
        </span>
        <span
          className={cn(
            'flex size-7 items-center justify-center rounded-full text-sm font-bold',
            isToday(day) ? 'bg-primary text-primary-foreground' : 'text-foreground'
          )}
        >
          {day.getDate()}
        </span>
      </div>

      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '72vh' }}>
        <div className="flex">
          <div
            className="relative w-14 shrink-0 border-r border-border"
            style={{ height: TOTAL_HEIGHT }}
          >
            {hours.map(h => (
              <div
                key={h}
                className="absolute right-2 text-right text-[10px] text-muted-foreground"
                style={{ top: (h - DAY_START_HOUR) * PX_PER_HOUR - 6 }}
              >
                {formatHour(h)}
              </div>
            ))}
          </div>

          <div
            ref={setNodeRef}
            role="button"
            tabIndex={0}
            className={cn(
              'relative flex-1 cursor-pointer transition-colors',
              isOver && 'bg-primary/5'
            )}
            style={{ height: TOTAL_HEIGHT }}
            onClick={e => {
              const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
              const yPx = e.clientY - rect.top;
              const rawMin = (yPx / PX_PER_HOUR) * 60;
              const snapped = Math.round(rawMin / 15) * 15;
              const h = DAY_START_HOUR + Math.floor(snapped / 60);
              const m = snapped % 60;
              onSlotClick(
                `${dayKey}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00`
              );
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSlotClick(`${dayKey}T09:00:00`);
              }
            }}
          >
            {hours.map(h => (
              <div
                key={h}
                className="pointer-events-none absolute right-0 left-0 border-t border-border/40"
                style={{ top: (h - DAY_START_HOUR) * PX_PER_HOUR }}
              />
            ))}
            {hours.map(h => (
              <div
                key={`h-${h}`}
                className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-border/20"
                style={{ top: (h - DAY_START_HOUR) * PX_PER_HOUR + PX_PER_HOUR / 2 }}
              />
            ))}

            {nowTop !== null && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20 flex items-center"
                style={{ top: nowTop }}
              >
                <span className="size-2 rounded-full bg-primary" />
                <div className="h-px flex-1 bg-primary" />
              </div>
            )}

            {dayAppts.map(appt => {
              const geo = blockGeometry(appt, DAY_START_HOUR, PX_PER_HOUR);
              const layoutInfo = layout.get(appt.id) ?? { column: 0, totalColumns: 1 };
              const conflict =
                appt.status === 'scheduled' &&
                hasConflict(
                  appointments.filter(a => a.id !== appt.id),
                  appt
                );
              return (
                <AppointmentBlock
                  key={appt.id}
                  appointment={appt}
                  geometry={geo}
                  column={layoutInfo.column}
                  totalColumns={layoutInfo.totalColumns}
                  hasConflict={conflict}
                  onClick={onAppointmentClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
