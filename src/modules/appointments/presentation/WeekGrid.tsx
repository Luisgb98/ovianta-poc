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

interface DayColumnProps {
  day: Date;
  appointments: Appointment[];
  allAppointments: Appointment[];
  onSlotClick: (iso: string) => void;
  onAppointmentClick: (appt: Appointment) => void;
}

function DayColumn({
  day,
  appointments,
  allAppointments,
  onSlotClick,
  onAppointmentClick,
}: DayColumnProps) {
  const dayKey = format(day, 'yyyy-MM-dd');
  const { setNodeRef, isOver } = useDroppable({ id: dayKey });

  const layout = layoutOverlaps(appointments);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'relative min-w-0 flex-1 border-l border-border transition-colors',
        isOver && 'bg-primary/5'
      )}
      style={{ height: TOTAL_HEIGHT }}
      onClick={e => {
        const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
        const yPx = e.clientY - rect.top;
        const rawMinutes = (yPx / PX_PER_HOUR) * 60;
        const snapped = Math.round(rawMinutes / 15) * 15;
        const hours = DAY_START_HOUR + Math.floor(snapped / 60);
        const mins = snapped % 60;
        const d = new Date(day);
        d.setHours(hours, mins, 0, 0);
        onSlotClick(
          `${dayKey}T${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:00`
        );
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
          key={`half-${h}`}
          className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-border/20"
          style={{ top: (h - DAY_START_HOUR) * PX_PER_HOUR + PX_PER_HOUR / 2 }}
        />
      ))}

      {appointments.map(appt => {
        const geo = blockGeometry(appt, DAY_START_HOUR, PX_PER_HOUR);
        const layoutInfo = layout.get(appt.id) ?? { column: 0, totalColumns: 1 };
        const conflict =
          appt.status === 'scheduled' &&
          hasConflict(
            allAppointments.filter(a => a.id !== appt.id),
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
  );
}

interface WeekGridProps {
  days: Date[];
  appointments: Appointment[];
  onSlotClick: (iso: string) => void;
  onAppointmentClick: (appt: Appointment) => void;
}

export function WeekGrid({ days, appointments, onSlotClick, onAppointmentClick }: WeekGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [nowTop, setNowTop] = useState<number | null>(null);

  useEffect(() => {
    function calcNow() {
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes() - DAY_START_HOUR * 60;
      if (mins < 0 || mins > (DAY_END_HOUR - DAY_START_HOUR) * 60) {
        setNowTop(null);
      } else {
        setNowTop((mins / 60) * PX_PER_HOUR);
      }
    }
    calcNow();
    const timer = setInterval(calcNow, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current && nowTop !== null) {
      scrollRef.current.scrollTop = Math.max(0, nowTop - 120);
    }
  }, [nowTop]);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      {/* Single scroll container — headers are sticky inside it so they always share the same width as the grid */}
      <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: '72vh' }}>
        {/* Sticky day-header row */}
        <div className="sticky top-0 z-30 flex border-b border-border bg-card">
          <div className="w-14 shrink-0 border-r border-border" />
          {days.map(day => {
            const today = isToday(day);
            return (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={cn(
                  'flex min-w-0 flex-1 flex-col items-center border-l border-border py-2',
                  today && 'bg-primary/5'
                )}
              >
                <span
                  className={cn(
                    'text-[10px] font-medium tracking-wider uppercase',
                    today ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {format(day, 'EEE')}
                </span>
                <span
                  className={cn(
                    'mt-0.5 flex size-7 items-center justify-center rounded-full text-sm font-bold',
                    today ? 'bg-primary text-primary-foreground' : 'text-foreground'
                  )}
                >
                  {day.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="flex">
          {/* Time axis */}
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

          {/* Day columns */}
          <div className="relative flex min-w-0 flex-1">
            {/* Current time line */}
            {nowTop !== null && days.some(d => isToday(d)) && (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20 flex items-center"
                style={{ top: nowTop }}
              >
                <span className="size-2 rounded-full bg-primary" />
                <div className="h-px flex-1 bg-primary" />
              </div>
            )}

            {days.map(day => {
              const dayAppts = appointments.filter(a => isSameDay(parseISO(a.start), day));
              return (
                <DayColumn
                  key={format(day, 'yyyy-MM-dd')}
                  day={day}
                  appointments={dayAppts}
                  allAppointments={appointments}
                  onSlotClick={onSlotClick}
                  onAppointmentClick={onAppointmentClick}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
