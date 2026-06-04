'use client';

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  format,
  parseISO,
} from 'date-fns';
import { cn } from '@/lib/utils';
import { Icon } from '@/components/atoms/icon';
import type { Appointment } from '../domain/appointment';

interface Props {
  anchor: Date;
  selected: Date;
  appointments: Appointment[];
  onSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
}

const DOW = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function MiniMonth({ anchor, selected, appointments, onSelect, onMonthChange }: Props) {
  const monthStart = startOfMonth(anchor);
  const monthEnd = endOfMonth(anchor);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const apptDays = new Set(
    appointments
      .filter(a => a.status !== 'cancelled')
      .map(a => format(parseISO(a.start), 'yyyy-MM-dd'))
  );

  return (
    <div className="w-[196px] shrink-0">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(anchor, -1))}
          className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Previous month"
        >
          <Icon name="chevronLeft" size={14} />
        </button>
        <span className="text-xs font-semibold capitalize">{format(anchor, 'MMMM yyyy')}</span>
        <button
          type="button"
          onClick={() => onMonthChange(addMonths(anchor, 1))}
          className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Next month"
        >
          <Icon name="chevronRight" size={14} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {DOW.map((d, i) => (
          <div key={i} className="py-0.5 text-center text-[10px] font-medium text-muted-foreground">
            {d}
          </div>
        ))}

        {days.map(day => {
          const dayKey = format(day, 'yyyy-MM-dd');
          const inMonth = isSameMonth(day, anchor);
          const isSelected = isSameDay(day, selected);
          const today = isToday(day);
          const hasAppt = apptDays.has(dayKey);

          return (
            <div key={dayKey} className="flex flex-col items-center gap-px">
              <button
                type="button"
                onClick={() => onSelect(day)}
                className={cn(
                  'grid size-6 place-items-center rounded-full text-[11px] transition-colors',
                  inMonth ? 'text-foreground' : 'text-muted-foreground/40',
                  today && !isSelected && 'font-bold text-primary',
                  isSelected && 'bg-primary font-semibold text-primary-foreground',
                  !isSelected && inMonth && 'hover:bg-muted'
                )}
              >
                {day.getDate()}
              </button>
              <span
                className={cn('size-1 rounded-full', hasAppt ? 'bg-primary/60' : 'invisible')}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
